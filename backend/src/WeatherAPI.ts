import got from "got";
import dayjs from "dayjs";
import IsSameOrBefore from "dayjs/plugin/isSameOrBefore"
import IsSameOrAfter from "dayjs/plugin/isSameOrAfter"
dayjs.extend(IsSameOrBefore);
dayjs.extend(IsSameOrAfter);

const key = "e8eed80242e6df98653dc11557fc3f90";
const baseUrl = "https://api.openweathermap.org/data/2.5";


export type Weather = {
  day: string,
  temperature: number,
  type: WeatherType
  humidity: number,
  visibility: number,
  wind_speed: number,
  wind_direction: number,
  high: number,
  low: number,
  clouds: number,
  sunrise: Date,
  sunset: Date,
}

export type WeatherType = {
  main: string,
  description: string,
  icon: string,
  id: number,
}


// Get weather for a city
export async function getCurrentWeather(lat: number, lon: number): Promise<Weather> {
  const url = `${baseUrl}/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`;
  const data = await got.get(url).json<any>();
  return {
    day: "Now",
    temperature: data.main.temp,
    type: data.weather[0],
    humidity: data.main.humidity,
    visibility: data.visibility,
    wind_speed: data.wind.speed,
    wind_direction: data.wind.deg,
    high: data.main.temp_max,
    low: data.main.temp_min,
    clouds: data.clouds.all,
    sunrise: new Date(data.sys.sunrise * 1000),
    sunset: new Date(data.sys.sunset * 1000),
  };
}


// Get 3-day forecast for a city
export async function get3DayWeather(lat: number, lon: number): Promise<Weather[]> {
  const url = `${baseUrl}/forecast?lat=${lat}&lon=${lon}&cnt=32&units=imperial&appid=${key}`;
  const data = await got.get(url).json<any>();
  const zeroToday = dayjs().startOf('day');

  const day1 = zeroToday.add(1, 'day'); // tomorrow
  const day2 = zeroToday.add(2, 'day');
  const day3 = zeroToday.add(3, 'day');
  const day4 = zeroToday.add(4, 'day');

  const day1Data = [];
  const day2Data = [];
  const day3Data = [];

  for(let point of data.list) {
    const time = dayjs(point.dt * 1000);
    if(point.weather[0].id === 800) point.weather.id = 900; // Fix so that clear skies are not counted as clouds
    if(time.isSameOrAfter(day1) && time.isBefore(day2)) {
      day1Data.push(point);
    } else if(time.isSameOrAfter(day2) && time.isBefore(day3)) {
      day2Data.push(point);
    } else if(time.isSameOrAfter(day3) && time.isBefore(day4)) {
      day3Data.push(point);
    }
  }

  const process = (acc: Weather, point: any) => ({
      temperature: Math.max(point.main.temp, acc.temperature ?? -9999),
      // The lower the number, the more severe the weather. Choose the lowest number
      type: Math.min(point.weather[0].id, acc.type ? acc.type.id : 1000) === point.weather[0].id ? point.weather[0] : acc.type,
      humidity: (point.main.humidity + acc.humidity ?? point.main.humidity) / 2,
      visibility: (point.visibility + acc.visibility ?? point.visibility) / 2,
      wind_speed: (point.wind.speed + acc.wind_speed ?? point.wind.speed) / 2,
      wind_direction: (point.wind.deg + acc.wind_direction ?? point.wind.deg) / 2,
      high: Math.max(point.main.temp_max, acc.high ?? -9999),
      low: Math.min(point.main.temp_min, acc.low ?? 9999),
      clouds: (point.clouds.all + acc.clouds ?? point.clouds.all) / 2,
      sunrise: -1,
      sunset: -1,
    }
  )

  const day1Weather = day1Data.reduce(process);
  const day2Weather = day2Data.reduce(process);
  const day3Weather = day3Data.reduce(process);

  day1Weather.day = "Tommorow";
  day2Weather.day = day2.format("dddd");
  day3Weather.day = day3.format("dddd");

  return [day1Weather, day2Weather, day3Weather];
}