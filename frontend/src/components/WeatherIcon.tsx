import {
  WiAlien,
  WiCloud,
  WiCloudy,
  WiDayHaze,
  WiDaySunny,
  WiDust,
  WiFog,
  WiNightAltCloudy,
  WiNightAltPartlyCloudy,
  WiNightAltRain,
  WiNightAltRainMix,
  WiNightAltSnow,
  WiNightAltStormShowers,
  WiNightClear,
  WiNightFog,
  WiRain,
  WiRainMix,
  WiSandstorm,
  WiSmoke,
  WiSnow,
  WiThunderstorm,
  WiTornado,
  WiVolcano,
} from "react-icons/wi";
import { Weather } from "../models/SocketMessage";

const WeatherIcon = ({
  weather,
  fontSize,
  style,
}: {
  weather: Weather;
  fontSize: string;
  style?: React.CSSProperties;
}) => {
  const now = new Date();
  const sunrise = new Date(weather.sunrise);
  const sunset = new Date(weather.sunset);
  const night = weather.sunrise !== -1 && (now < sunrise || now > sunset);
  switch (weather.type?.id ?? 900) {
    // Clear
    case 800:
    case 900:
      return night ? (
        <WiNightClear fontSize={fontSize} style={style} />
      ) : (
        <WiDaySunny fontSize={fontSize} style={style} />
      );
    // Cloudy
    case 804: // Overcast
    case 803:
      return night ? (
        <WiNightAltCloudy fontSize={fontSize} style={style} />
      ) : (
        <WiCloudy fontSize={fontSize} style={style} />
      ); // Broken Clouds
    case 802: // Scattered Clouds
    case 801:
      return night ? (
        <WiNightAltPartlyCloudy fontSize={fontSize} style={style} />
      ) : (
        <WiCloud fontSize={fontSize} style={style} />
      ); // Few Clouds
    // Atmosphere
    case 701: // Mist
    case 761: // Dust
    case 771: // Squall
    case 731:
      return <WiDust fontSize={fontSize} style={style} />; // sand/dust whirls
    case 711:
      return <WiSmoke fontSize={fontSize} style={style} />; // Smoke
    case 721:
      return night ? (
        <WiNightFog fontSize={fontSize} style={style} />
      ) : (
        <WiDayHaze fontSize={fontSize} style={style} />
      ); // Haze
    case 741:
      return <WiFog fontSize={fontSize} style={style} />; // Fog
    case 751:
      return <WiSandstorm fontSize={fontSize} style={style} />; // Sand
    case 762:
      return <WiVolcano fontSize={fontSize} style={style} />; // Ash
    case 781:
      return <WiTornado fontSize={fontSize} style={style} />; // Tornado
    // Snow
    case 600: // Light Snow
    case 601: // Snow
    case 602: // Heavy Snow
    case 611: // Sleet
    case 612: // Light Shower Sleet
    case 613: // Shower Sleet
    case 615: // Light Rain and Snow
    case 616: // Rain and Snow
    case 620: // Light Shower Snow
    case 621: // Shower Snow
    case 622:
      return night ? (
        <WiNightAltSnow fontSize={fontSize} style={style} />
      ) : (
        <WiSnow fontSize={fontSize} style={style} />
      ); // Heavy Shower Snow
    // Rain
    case 500: // Light Rain
    case 501: // Moderate Rain
    case 502: // Heavy Intensity Rain
    case 503: // Very Heavy Rain
    case 504:
      return night ? (
        <WiNightAltRain fontSize={fontSize} style={style} />
      ) : (
        <WiRain fontSize={fontSize} style={style} />
      ); // Extreme Rain
    case 511:
      return night ? (
        <WiNightAltSnow fontSize={fontSize} style={style} />
      ) : (
        <WiSnow fontSize={fontSize} style={style} />
      ); // Freezing Rain
    case 520: // Light Intensity Shower Rain
    case 521: // Shower Rain
    case 522: // Heavy Intensity Shower Rain
    case 531:
      return night ? (
        <WiNightAltRainMix fontSize={fontSize} style={style} />
      ) : (
        <WiRainMix fontSize={fontSize} style={style} />
      ); // Ragged Shower Rain
    // Drizzle
    case 300: // Light Intensity Drizzle
    case 301: // Drizzle
    case 302: // Heavy Intensity Drizzle
    case 310: // Light Intensity Drizzle Rain
    case 311: // Drizzle Rain
    case 312: // Heavy Intensity Drizzle Rain
    case 313: // Shower Rain and Drizzle
    case 314: // Heavy Shower Rain and Drizzle
    case 321:
      return night ? (
        <WiNightAltRain fontSize={fontSize} style={style} />
      ) : (
        <WiRain fontSize={fontSize} style={style} />
      ); // Shower Drizzle
    // Thunderstorm
    case 200: // Thunderstorm with Light Rain
    case 201: // Thunderstorm with Rain
    case 202: // Thunderstorm with Heavy Rain
    case 210: // Light Thunderstorm
    case 211: // Thunderstorm
    case 212: // Heavy Thunderstorm
    case 221: // Ragged Thunderstorm
    case 230: // Thunderstorm with Light Drizzle
    case 231: // Thunderstorm with Drizzle
    case 232:
      return night ? (
        <WiNightAltStormShowers fontSize={fontSize} style={style} />
      ) : (
        <WiThunderstorm fontSize={fontSize} style={style} />
      ); // Thunderstorm with Heavy Drizzle

    default:
      return <WiAlien fontSize={fontSize} style={style} />; // Unknown?
  }
};

export default WeatherIcon;
