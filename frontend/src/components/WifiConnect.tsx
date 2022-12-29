import WifiNetwork from "../models/WifiNetwork";
import {useEffect, useState} from "preact/hooks";
import {
  Box,
  Button, Checkbox, CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormControlLabel, IconButton,
  List,
  ListItem, ListItemButton, ListItemIcon, TextField, Typography
} from "@mui/material";
import React from "react";
import {ChevronLeft, Lock, LockOpen} from "@mui/icons-material";
import {useSocket} from "../data/hooks/useSocket";
import KeyboardWrapper from "./KeyboardWrapper";

interface IProps {
  networks: WifiNetwork[];
  onClose: () => void;
  open: boolean;
}

const SelectedWifi = ({
                        network,
                        onSuccess,
                        onBack
                      }: { network: WifiNetwork, onSuccess: () => any, onBack: () => any }) => {

  const socket = useSocket();

  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onFail = () => {
    setError(true);
    setLoading(false);
  }

  const onConnect = () => {
    setLoading(false);
    setSuccess(true);
    onSuccess();
  }

  useEffect(() => {
    // Register Events
    socket.removeListener("connected-wifi", onConnect);
    socket.addListener("connected-wifi", onConnect);

    socket.removeListener("wifi-failed", onFail);
    socket.addListener("wifi-failed", onFail);

    // Auto-connect if security is disabled
    if (network.security === "Open") {
      setLoading(true);
      socket.connectWifi(network.ssid, "");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const doConnect = () => {
    setLoading(true);
    socket.connectWifi(network.ssid, password);
  }

  return (
    <>
      <IconButton onClick={onBack}><ChevronLeft/></IconButton>
      <Typography variant={"h6"}>{network.ssid}</Typography>
      <Typography variant={"subtitle2"}>Security: {network.security}</Typography>
      <Typography variant={"subtitle2"}>Channel: {network.channel}</Typography>
      <Typography variant={"subtitle2"}>Quality: {network.quality}</Typography>
      <Typography variant={"subtitle2"}>Frequency: {network.frequency}</Typography>
      <Typography variant={"subtitle2"}>Signal Level: {network.signal_level}</Typography>
      {!loading && !success &&
        <>
          <TextField variant={"standard"} onChange={e => setPassword(e.target.value)} fullWidth label={"Password"}
                     type={showPassword ? "text" : "password"} value={password} autoFocus/>
          <FormControlLabel control={<Checkbox onChange={e => setShowPassword(e.target.checked)}/>}
                            label="Show Password"/>
          <Button sx={{mt: 1}} fullWidth onClick={doConnect} variant={"contained"}>Connect</Button>
          {error &&
            <Typography variant={"subtitle2"} color={"error"}>
              Failed to connect to network. Ensure that the password is correct!
            </Typography>
          }
          <Box sx={{color: "black", mt: 1}}>
            <KeyboardWrapper onChange={setPassword}/>
          </Box>
        </>
      }
      {loading && <Typography variant={"subtitle2"}><CircularProgress/>Connecting...</Typography>}
      {success &&
        <Typography variant={"subtitle2"} color={"success"}>Connected successfully, this window should now close
          automatically. If it does not, you may click "cancel".</Typography>}
    </>
  )
}

const WifiConnect = ({networks, onClose, open}: IProps) => {

  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null);

  const handleClose = () => {
    onClose();
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle> Connect to a WiFi Network</DialogTitle>
        <DialogContent>
          {selectedNetwork !== null &&
            <SelectedWifi network={selectedNetwork} onBack={() => setSelectedNetwork(null)} onSuccess={handleClose}/>
          }
          {selectedNetwork === null &&
            <List>
              {networks.map((network, index) => (
                <ListItem key={network.mac}>
                  <ListItemIcon>{network.security !== 'Open' ? <Lock/> : <LockOpen/>}</ListItemIcon>
                  <ListItemButton onClick={() => setSelectedNetwork(network)}>
                    {network.ssid}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )

}


export default WifiConnect;