import {CircularProgress, Grid, Typography} from "@mui/material";
import {ArrowDropDown, ArrowDropUp} from "@mui/icons-material";
import {Variant} from "@mui/material/styles/createTypography";
import {useEffect, useState} from "preact/hooks";
import {Weather} from "../models/SocketMessage";
import {useSocket} from "../data/hooks/useSocket";
import {useFitText} from "@flyyer/use-fit-text";
import WeatherIcon from "./WeatherIcon";

const HighLowRow = ({high, low, variant}: { high: number, low: number, variant: Variant }) => {
  const margin = variant === "h5" ? "3px" : 0;
  return (
    <Grid container direction={"row"} sx={{textAlign: "center"}}>
      <Grid item xs={1} />
      <Grid item xs={1} sx={{marginLeft: "1px"}}>
        <Typography variant={variant} sx={{marginTop: margin}}><ArrowDropUp/></Typography>
      </Grid>
      <Grid item xs={4} sx={{textAlign: "center"}}>
        <Typography variant={variant}>{Math.round(high)}°</Typography>
      </Grid>
      <Grid item xs={1} sx={{marginLeft: "1px"}}>
        <Typography variant={variant} sx={{marginTop: margin}}><ArrowDropDown/></Typography>
      </Grid>
      <Grid item xs={4} sx={{textAlign: "center"}}>
        <Typography variant={variant}>{Math.round(low)}°</Typography>
      </Grid>
      <Grid item xs={1} />
    </Grid>
  )
}

const WeatherDay = ({weather}: { weather: Weather }) => {
  return (
    <Grid container direction={"column"} sx={{ml: 2, textAlign: "center"}}>
      <Grid item>
        <Typography variant={"body1"}>{weather.day}</Typography>
      </Grid>
      <Grid item sx={{my: -2}}>
        <WeatherIcon weather={weather} fontSize={"4rem"} />
      </Grid>
      <Grid item>
        <HighLowRow high={weather.high} low={weather.low} variant={"body1"}/>
      </Grid>
    </Grid>
  )
}

const WeatherWidget = () => {

  const socket = useSocket();

  const [forecast, setForecast] = useState<Weather[]>([]);
  const [weather, setWeather] = useState<Weather>({} as Weather);

  useEffect(() => {
    socket.removeListener("weather", setWeather);
    socket.addListener("weather", setWeather);
    socket.removeListener("forecast", setForecast);
    socket.addListener("forecast", setForecast);
    socket.getWeather();
    socket.getForecast();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const {fontSize, ref} = useFitText({maxFontSize: 1000}, [weather]);

  return (
    <>
      <Grid container direction={"row"} sx={{m: 0, display: (typeof weather.temperature === "undefined") ? "none" : undefined}} justifyContent={"center"} alignItems={"center"}>
        {/* Weather Now Icon */}
        <Grid item sx={{m: 0}}>
          <WeatherIcon weather={weather} fontSize={"9rem"} style={{marginLeft: "-16px", marginRight: "-16px"}}/>
        </Grid>

        {/* Weather Now Temp / Today's High/Low */}
        <Grid item sx={{mt: "10px", ml: "-3px", mr: -2}}>
          <Grid container direction={"column"} sx={{textAlign: "center"}}>

            {/* Temp Now */}
            <Grid item>
              <Typography ref={ref} variant={"h1"} sx={{marginBottom: "-20px", fontSize, height: "110px"}}>{Math.round(weather.temperature)}°</Typography>
            </Grid>

            {/* Today's High/Low */}
            <Grid item>
              <HighLowRow high={weather.high} low={weather.low} variant={"h5"}/>
            </Grid>

          </Grid>
        </Grid>

        {/* Forecast */}
        {
          forecast.map((day) =>
            <Grid item key={day.day} sx={{marginTop: 5, marginLeft: -2}}>
              <WeatherDay key={day.day} weather={day}/>
            </Grid>
          )
        }

      </Grid>

      {/* Loading Weather */}
      { typeof weather.temperature === "undefined" &&
        <Grid container direction={"row"} justifyContent={"center"} alignItems={"center"}>
          {/* Loading */}
          <Grid item>
            <CircularProgress />
          </Grid>
          <Grid item sx={{ml: 1}}>
            <Typography variant={"h5"}>Loading Weather...</Typography>
          </Grid>
        </Grid>
      }
    </>
  );
}

export default WeatherWidget;