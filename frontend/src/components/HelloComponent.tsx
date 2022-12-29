import * as React from "react";
import {Divider, Grid, Typography} from "@mui/material";
import WeatherWidget from "./WeatherWidget";
import TimeWidget from "./TimeWidget";
import {useEffect, useState} from "preact/hooks";
import useFitText from "use-fit-text";
import {GreetingType, Theme, Time} from "../models/SocketMessage";
import {useSocket} from "../data/hooks/useSocket";

const HelloComponent = () => {

  const socket = useSocket();

  const [time, setTime] = useState<Time>({greeting: {greeting: "Loading...", greeting_type: GreetingType.custom, theme: Theme.day}, date_string: "Loading...", time_string: "Loading..."});

  const {fontSize, ref} = useFitText({maxFontSize: 1000});

  useEffect(() => {
    socket.removeListener("time", setTime);
    socket.addListener("time", setTime);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Grid container direction={"column"} sx={{mx: 0, px: 1, height: "100%"}}>

        {/* Greeting */}
        <Grid item xs={3} sx={{textAlign: "center", mb: 2, mt: 1}}>
          <Typography ref={ref} sx={{fontSize, fontWeight: 500, lineHeight: "1", height: "100%"}}>{time.greeting.greeting}, Emily</Typography>
          <Divider />
        </Grid>

        {/* Time */}
        <Grid item sx={{mt: "auto"}}>
          <TimeWidget time={time} />
        </Grid>

        {/* Time */}
        {/*<Grid item>*/}
        {/*  <Typography>Extra Content </Typography>*/}
        {/*</Grid>*/}

        {/* Weather */}
        <Grid item sx={{mt: "auto"}} >
          <WeatherWidget />
        </Grid>

      </Grid>
    </>
  );
}

export default HelloComponent;