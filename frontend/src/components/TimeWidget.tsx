import {Grid, Typography} from "@mui/material";
import {Time} from "../models/SocketMessage";

const TimeWidget = ({time}: {time: Time}) => {
  return (
    <>
      <Grid container direction={"column"} sx={{ml: 1, textAlign: "center"}}>
        {/* Date Icon */}
        <Grid item>
          <Typography sx={{fontSize: "1.5rem", fontWeight: '500'}}>{time.date_string}</Typography>
        </Grid>

        {/* Time Now Icon */}
        <Grid item sx={{mt: "-10px", mb: "-10px"}}>
          <Typography sx={{fontSize: "7rem", fontWeight: '100', lineHeight: '1'}}>{time.time_string}</Typography>
        </Grid>

      </Grid>
    </>
  );
}

export default TimeWidget;