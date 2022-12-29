import dayjs from "dayjs";
import AdvancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(AdvancedFormat);

const greetings = {
  "morning": [
    "Good morning",
    "Wakey, wakey",
    "Guten Morgen",
    "Rise and shine",
    "Morning",
    "Top of the morning to you",
    "Have a great day",
    "Buenos dias",
    "Looking great",
    "Slay the day"
  ],

  "day": [
    "Hiya",
    "Hi",
    "Guten Tag",
    "Good afternoon",
    "Howdy",
    "G'day",
    "Hello there",
    "Hi there",
    "Slayin as usual"
  ],

  "evening": [
    "Good evening",
    "Nice to see you",
    "Hellooooo",
    "Konbanwa",
    "Enjoy the rest of your evening",
    "Fancy seeing you here",
    "It's late. Time to rest",
    "Would you look at the time",
    "Shouldn't you be in bed",
  ]
}

enum Theme {
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

enum GreetingType {
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

const getGreeting = (now?: dayjs.Dayjs): Greeting => {
  now = now ?? dayjs();
  const month = now.month(); // 0-11
  const day = now.date();
  const hour = now.hour();
  const year = now.year();

  let greeting;
  let theme = Theme.day;
  let greetingType = GreetingType.custom;

  // Special occasions
  if (month === 11 && day === 25) { // Christmas
    greeting = "Merry Christmas";
    theme = Theme.christmas;
  } else if (month === 0 && day === 1) { // New Years
    greeting = "Happy New Year";
    theme = Theme.newYears;
  }  else if (month === 5 && day === 2) { // Birthday
    greeting = "Happy Birthday";
    theme = Theme.birthday;
  } else if (month === 6 && day === 4) { // Independence Day
    greeting = "'Merica";
    theme = Theme.patriotic;
  } else if (month === 7 && day === 31) { // Anniversary
    const n = year - 2022;
    greeting = `Happy ${n}-Year Anniversary`;
    theme = Theme.anniversary;
  } else if (month === 9 && day === 31) { // Halloween
    greeting = "Happy Halloween";
    theme = Theme.halloween;
  } else if (month === 9 && day === 1) { // Spooky Szn
    greeting = "It's officially spooky szn";
    theme = Theme.halloween;
  } else {
    if (hour < 12) {
      greeting = greetings.morning[Math.floor(Math.random() * greetings.morning.length)];
      greetingType = GreetingType.morning;
      theme = Theme.morning;
    } else if (hour < 18) {
      greeting = greetings.day[Math.floor(Math.random() * greetings.day.length)];
      greetingType = GreetingType.day;
      theme = Theme.day;
    } else {
      greeting = greetings.evening[Math.floor(Math.random() * greetings.evening.length)];
      greetingType = GreetingType.evening;
      theme = Theme.night;
    }
  }

  if (day === 31) theme = Theme.anniversary; // Month-a-versary

  return { greeting, theme, greeting_type: greetingType };
}


export function getTime(lastGreeting?: Greeting)  {
  const now = dayjs();

  // Format date like Wednesday, December 1st using dayjs
  const date = dayjs().format("dddd, MMMM Do, YYYY");

  // Format time like 12:00 PM using dayjs
  const time = dayjs().format("h:mm A");

  let greeting = getGreeting(now);

  // Prevent greeting from changing too often
  if(lastGreeting && lastGreeting.greeting_type === greeting.greeting_type) {
    greeting = lastGreeting;
  }

  return {date_string: date, time_string: time, greeting: greeting};
}