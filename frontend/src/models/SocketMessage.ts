export type Weather = {
  temperature: number,
  type: WeatherType
  humidity: number,
  visibility: number,
  wind_speed: number,
  wind_direction: number,
  high: number,
  low: number,
  clouds: number,
  sunrise: string | number,
  sunset: string | number,
  day: string,
}

export type WeatherType = {
  main: string,
  description: string,
  icon: string,
  id: number,
}

export enum Theme {
  day,
  night,
  morning,
  christmas,
  halloween,
  newYears,
  anniversary,
  patriotic,
  birthday,
}

export enum GreetingType {
  day,
  evening,
  morning,
  custom,
}

export type Greeting = {
  greeting: string,
  theme: Theme,
  greeting_type: GreetingType,
}

export type Time = {
  date_string: string, time_string: string, greeting: Greeting
}

export type Control = {
  opacity: number,
  show_photo: boolean,
}