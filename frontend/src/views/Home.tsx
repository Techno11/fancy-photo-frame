import {
  Box, CircularProgress, Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Slide
} from "@mui/material";
import * as React from "react";
import HelloComponent from "../components/HelloComponent";
import {useEffect, useState} from "preact/hooks";
import {useSocket} from "../data/hooks/useSocket";
import {Control} from "../models/SocketMessage";
import WiFiNetwork from "../models/WifiNetwork";
import WifiConnect from "../components/WifiConnect";


const styles =
  {
    mainIn: {
      m: 0,
      height: "100%",
      transition: `all .5s cubic-bezier(0, 0, 0.2, 1)`,
      transform: `translateX(0)`
    },
    mainOut: {
      m: 0,
      height: "100%",
      transition: `all .5s cubic-bezier(0.4, 0, 0.6, 1)`,
      transform: `translateX(30%)`
    }
  };

const Home = () => {

  // Data to control viewing photo and opacity of screen
  const [controlData, setControlData] = useState<Control>({opacity: 0, show_photo: false});

  // Photo blob
  const [photo, setPhoto] = useState<string>("");

  // Show wifi connect dialog
  const [showWifiConfig, setShowWifiConfig] = useState<boolean>(false);

  // Wifi networks (for connection dialog)
  const [avalNetworks, setAvalNetworks] = useState<WiFiNetwork[]>([]);

  // State to detect if we've got internet
  const [gotInternet, setGotInternet] = useState<boolean>(false);

  // Show startup dialog
  const [showStartup, setShowStartup] = useState<boolean>(false);

  // Startup message
  const [startupMessage, setStartupMessage] = useState<string>("");

  // Socket
  const socket = useSocket();

  const needWifi = (networks: WiFiNetwork[]) => {
    setAvalNetworks(networks);
    setShowWifiConfig(true);
    console.log("need wifi");
  }

  const internetDisconnected = () => setGotInternet(false);
  const internetConnected = () => {
    setGotInternet(true);
    setShowWifiConfig(false);
    console.log("internet connected");
  }

  const startupInProgress = ({message}: { message: string }) => {
    setShowStartup(true);
    setStartupMessage(message);
    console.log("Startup in progress", message);
  }

  const startupComplete = () => {
    setShowStartup(false);
    console.log("Startup complete");
  }

  useEffect(() => {
    // Wifi networks
    socket.addListener("need-wifi", needWifi);
    socket.getNeedWifi();

    // Internet connection status
    socket.addListener("internet-connected", internetConnected);
    socket.addListener("internet-disconnected", internetDisconnected);
    socket.getGotInternet();

    // Startup messages
    socket.removeListener("startup-in-progress", startupInProgress);
    socket.addListener("startup-in-progress", startupInProgress);
    socket.removeListener("startup-complete", startupComplete);
    socket.addListener("startup-complete", startupComplete);

    // Photo Data
    const getPhoto = () => socket.getPhoto().then(url => {
      if (photo.length > 0) URL.revokeObjectURL(photo);
      setPhoto(url);
    }).catch(console.log);
    socket.removeListener("photo", getPhoto);
    socket.addListener("photo", getPhoto);
    getPhoto();

    // Page control data
    const setCtrl = (data: Control) => setControlData(data);
    socket.removeListener("control", setCtrl);
    socket.addListener("control", setCtrl);
    socket.getControl();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {

    console.log("Show Startup?", showStartup, "Show Wifi?", showWifiConfig, "Message", startupMessage);
  }, [showStartup, showWifiConfig, startupMessage]);

  const openWifi = () => {
    socket.forceWifi();
  }

  return (
    <>
      {!gotInternet &&
        <Box
          sx={{
            position: "absolute",
            backgroundColor: "rgba(255, 0, 0, .5)",
            textAlign: "center",
            width: "100%",
            zIndex: 100
          }}
          onClick={openWifi}
        >
          No internet connection. Tap here to connect...
        </Box>
      }
      <Grid container direction={"row"} sx={{
        height: "100%",
        opacity: controlData.opacity,
        transition: `opacity .5s`,
        zIndex: 1,
        position: 'absolute',
        overflow: 'hidden'
      }}>
        <Grid item xs={7} sx={controlData.show_photo ? styles.mainIn : styles.mainOut}>
          <HelloComponent/>
        </Grid>
        <Slide direction={'left'} in={controlData.show_photo} timeout={{enter: 500, exit: 500}}>
          <Grid item xs={5} sx={{height: "100%", textAlign: "right"}}>
            <img alt="Random" style={{objectFit: "contain", maxHeight: "100%", maxWidth: "100%"}} src={photo}/>
          </Grid>
        </Slide>
      </Grid>

      {/* Wifi Connection Dialog */}
      <WifiConnect networks={avalNetworks} onClose={() => setShowWifiConfig(false)} open={showWifiConfig}/>

      {/* Startup Dialog */}
      {!showWifiConfig &&
        <Dialog open={showStartup} sx={{zIndex: 101}}>
          <DialogTitle>Starting Up...</DialogTitle>
          <DialogContent>
            <DialogContentText key={startupMessage}><CircularProgress size={1}/> {startupMessage}</DialogContentText>
          </DialogContent>
        </Dialog>
      }
    </>
  )
}

export default Home;