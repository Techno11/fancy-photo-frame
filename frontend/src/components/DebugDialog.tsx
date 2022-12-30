import {
  Accordion, AccordionDetails, AccordionSummary,
  Box,
  Button, CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  Tabs, Typography
} from "@mui/material";
import * as React from "react";
import DebugInfo, {LocalDebugInfo} from "../models/DebugInfo";
import {useEffect, useState} from "preact/hooks";
import {useSocket} from "../data/hooks/useSocket";
import {ArrowDropDown} from "@mui/icons-material";

const DebugDialog = ({open, onClose, gotInternet}: {open: boolean, onClose: () => void, gotInternet: boolean}) => {

  const [loading, setLoading] = useState<boolean>(true);
  const [debug, setDebug] = useState<DebugInfo>();
  const [tab, setTab] = useState<any>(0);
  const [expandedNetwork, setExpandedNetwork] = useState<string>("none");
  const [expandedWifi, setExpandedWifi] = useState<string>("none");  // Debug stats
  const [debugStats, setDebugStats] = useState<LocalDebugInfo>({
    last_time: new Date(NaN),
    last_weather: new Date(NaN),
    last_forecast: new Date(NaN),
    last_photo: new Date(NaN),
    socket_connected: "Unknown"
  });

  // Use socket
  const socket = useSocket();

  useEffect(() => {
    if(open) {
      doStartup();
      setDebugStats({
        socket_connected: socket.getSocketStatus() ? "Connected" : "Disconnected",
        last_time: socket.getLastTime(),
        last_weather: socket.getLastWeather(),
        last_forecast: socket.getLastForecast(),
        last_photo: socket.getLastPhoto()
      });
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const doStartup = async () => {
    setLoading(true);
    await socket.getDebugData().then(setDebug).catch(console.error);
    setLoading(false);
  }

  return (
    <Dialog open={open} sx={{zIndex: 101}} onClose={onClose}>
      <DialogTitle>Debug Information</DialogTitle>
      <DialogContent sx={{minHeight: "70vh"}}>
        <Tabs value={tab} onChange={(e, t) => setTab(t)} sx={{mb: 1}} >
          <Tab label="General" />
          <Tab label="Network" />
          <Tab label="Wifi" />
          <Tab label="System" />
          <Tab label="Loaction" />
        </Tabs>

        {/* Loading */}
        {loading && <DialogContentText sx={{textAlign: "center"}}><CircularProgress size={20} /> Loading...</DialogContentText>}

        {/* General Tab */}
        { tab === 0 && !loading && debug &&
          <Box>
            <DialogContentText>Time Sent: {debugStats.last_time.toJSON()}</DialogContentText>
            <DialogContentText>Forecast Sent: {debugStats.last_forecast.toJSON()}</DialogContentText>
            <DialogContentText>Weather Sent: {debugStats.last_weather.toJSON()}</DialogContentText>
            <DialogContentText>Photo Sent: {debugStats.last_photo.toJSON()}</DialogContentText>
            <DialogContentText>Internet Connected: {gotInternet ? "Connected" : "Disconnected"}</DialogContentText>
            <DialogContentText>Socket Connected: {debugStats.socket_connected}</DialogContentText>
          </Box>
        }

        {/* Network Tab */}
        { tab === 1 && !loading && debug &&
          <Box>
            {debug.interfaces.map(iface => (
              <Accordion key={iface.iface} expanded={expandedNetwork === iface.iface} onChange={() => setExpandedNetwork(expandedNetwork === iface.iface ? "none" : iface.iface)}>
                <AccordionSummary expandIcon={<ArrowDropDown />}>
                  {iface.iface}
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant={'subtitle1'}>Name: {iface.iface_name}</Typography>
                  <Typography variant={'subtitle1'}>DHCP: {iface.dhcp ? "Yes" : "No"}</Typography>
                  <Typography variant={'subtitle1'}>Internal: {iface.internal ? "Yes" : "No"}</Typography>
                  <Typography variant={'subtitle1'}>MAC: {iface.mac}</Typography>
                  <Typography variant={'subtitle1'}>IPv4: {iface.ipv4}</Typography>
                  <Typography variant={'subtitle2'}>Subnet: {iface.ipv4_subnet}</Typography>
                  <Typography variant={'subtitle1'}>IPv6: {iface.ipv6}</Typography>
                  <Typography variant={'subtitle2'}>Subnet: {iface.ipv6_subnet}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        }

        {/* Wifi Tab */}
        { tab === 2 && !loading && debug &&
          <Box>
            {!loading && debug && debug.active_wifi.map(wifi => (
              <Accordion key={wifi.id} expanded={expandedWifi === wifi.id} onChange={() => setExpandedWifi(expandedNetwork === wifi.id ? "none" : wifi.id)}>
                <AccordionSummary expandIcon={<ArrowDropDown />}>
                  {wifi.ssid} on {wifi.iface}
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant={'subtitle1'}>BSSID: {wifi.bssid}</Typography>
                  <Typography variant={'subtitle1'}>Type: {wifi.type}</Typography>
                  <Typography variant={'subtitle1'}>Channel: {wifi.channel}</Typography>
                  <Typography variant={'subtitle1'}>Model: {wifi.model}</Typography>
                  <Typography variant={'subtitle1'}>Security: {wifi.security}</Typography>
                  <Typography variant={'subtitle1'}>Signal Level: {wifi.signal_level}</Typography>
                  <Typography variant={'subtitle1'}>Uplink Speed: {wifi.tx_rate}</Typography>
                  <Typography variant={'subtitle1'}>Frequency: {wifi.frequency}</Typography>
                  <Button onClick={() => socket.forgetWifi(wifi.ssid)}>Connect</Button>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        }

        {/* System Tab */}
        { tab === 3 && !loading && debug &&
          <Box>
            <DialogContentText>System Time: {debug.system.time} ms</DialogContentText>
            <DialogContentText>Uptime: {debug.system.uptime.toFixed(2)} hours</DialogContentText>
            <DialogContentText>System Timezone: {debug.system.timezone_name} ({debug.system.timezone})</DialogContentText>
            <DialogContentText>CPU Speed: {debug.cpu.current_speed} ghz</DialogContentText>
            <DialogContentText>CPU Temp: {debug.cpu.current_temp}</DialogContentText>
            <DialogContentText>Memory Used: {debug.memory.used.toFixed(2)} mb</DialogContentText>
            <DialogContentText>Memory Free: {debug.memory.free.toFixed(2)} mb</DialogContentText>
            <DialogContentText>Memory Total: {debug.memory.total.toFixed(2)} mb</DialogContentText>
            <Button variant={"contained"} onClick={() => socket.restartServer()}>Reboot Server</Button>
            <Button variant={"contained"} onClick={() => document.location.reload()} sx={{marginLeft: 1}}>Reload Page</Button>
          </Box>
        }

        {/* Location Tab */}
        { tab === 4 && !loading && debug &&
          <Box>
            <DialogContentText>Latitude: {debug.locataion.latitude}</DialogContentText>
            <DialogContentText>Longitude: {debug.locataion.longitude}</DialogContentText>
            <DialogContentText>Public IP: {debug.public_ip}</DialogContentText>
          </Box>
        }
      </DialogContent>

      {/* Close */}
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default DebugDialog;