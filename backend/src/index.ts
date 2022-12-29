import * as dotenv from 'dotenv';
import path from 'path';
import ExpressSocketServer from "./ExpressSocketServer";
import {Socket} from "socket.io";
import ConfigManager from "./ConfigManager";
import cron from 'node-cron';
import getLongLat from "./IPAPI";
import {get3DayWeather, getCurrentWeather, Weather} from "./WeatherAPI";
import {getTime, Greeting} from "./scheduleables/GetTime";
import Control from "./models/Control";
import PiWifi from "./scheduleables/Wifi";
import got from "got";

// Setup dotenv
dotenv.config({path: path.join(__dirname, '../.env')});
// Get package.json for version
const packageJson = require('../package.json');

// Setup wifi
const wifi = new PiWifi();


console.log('✅ Starting Fancy Photo Frame Backend v' + packageJson.version);

const config = new ConfigManager();
const io = new ExpressSocketServer().getIO();

// Some globals
let lonLat = {longitude: 0, latitude: 0};
let fetchingLonLat = {ref: false};
let forecast: Weather[] = [];
let fetchingForecast = {ref: false};
let weather: Weather = {} as Weather;
let fetchingWeather = {ref: false};
let greeting: Greeting = {} as Greeting;
let control: Control = {opacity: 100, show_photo: true};
let needWifi = {ref: true};
let gotInternet = {ref: false};
let startupComplete = {ref: false};

const haveInternet = () => gotInternet.ref || !needWifi.ref;

// Setup Socket Connector
io.on('connection', async (client: Socket) => {

  // If we need wifi, emit on first connect
  if(needWifi.ref && !gotInternet.ref) {
    client.emit('need-wifi', await wifi.getNetworks());
  }

  // Emit starting
  if(!startupComplete.ref) {
    client.emit('startup-in-progress', {message: "Starting up..."});
  }

  client.on('disconnect', () => {
    client.disconnect();
  });

  client.on('drip', () => {
    client.emit('drop');
  });

  client.on('get-time', () => {
    client.emit('time', getTime(greeting));
  });

  client.on('get-weather', () => {
    if(!fetchingWeather.ref && Object.keys(weather).length > 0) client.emit('weather', weather);
  });

  client.on('get-forecast', () => {
    if(!fetchingForecast.ref && Object.keys(forecast).length > 0) client.emit('forecast', forecast);
  });

  client.on('get-control', () => {
    client.emit('control', control);
  });

  client.on('get-need-wifi', async () => {
    if(needWifi.ref && !gotInternet.ref) {
      const networks = await wifi.getNetworks();
      client.emit('need-wifi', networks);
    }
  });

  client.on('force-wifi', async () => {
    const networks = await wifi.getNetworks();
    client.emit('need-wifi', networks);
  });

  client.on('get-got-internet', () => {
    if(gotInternet.ref) client.emit('internet-connected');
    else client.emit('internet-disconnected');
  });

  client.on('connect-wifi', async ({ssid, password}: {ssid: string, password: string}) => {
    wifi.connect(ssid, password).catch(console.log).finally(async () => {
      const conns = await wifi.getStatus();
      console.log("Connected to wifi", conns);
      if(conns.length > 0) {
        needWifi.ref = false;
        io.emit('connected-wifi');
        io.emit('startup-in-progress', {message: "Starting up..."});
        doStartup();
      } else {
        io.emit('wifi-failed');
      }
    })
  });

  client.on('restart', () => {
    process.exit(1);
  });
});

async function updateLongLat() {
  if(!haveInternet() || fetchingLonLat.ref) return;
  fetchingLonLat.ref = true;
  const ll = await getLongLat();
  lonLat.latitude = ll.latitude;
  lonLat.longitude = ll.longitude;
  fetchingLonLat.ref = false;
}

async function updateForecast(startup: boolean = false) {
  if(!haveInternet() || fetchingForecast.ref) return;
  // If we're in startup, emit that we're fetching
  if(startup) io.emit("startup-in-progress", {message: "Fetching location..."});
  // Get LonLat
  // TODO: Renable this
  // await updateLongLat();
  // If we're in startup, emit that we're fetching
  if(startup) io.emit("startup-in-progress", {message: "Fetching forecast..."});
  fetchingForecast.ref = true;
  forecast = await get3DayWeather(lonLat.latitude, lonLat.longitude);
  fetchingForecast.ref = false;
  io.emit('forecast', forecast);
}

async function updateWeather(startup: boolean = false) {
  if(!haveInternet() || fetchingWeather.ref) return;
  if(startup) io.emit("startup-in-progress", {message: "Fetching current weather..."});
  fetchingWeather.ref = true;
  weather = await getCurrentWeather(lonLat.latitude, lonLat.longitude);
  fetchingWeather.ref = false;
  io.emit('weather', weather);
}

async function updateTime() {
  const full = getTime(greeting);
  greeting = full.greeting;
  io.emit('time', full);
}

async function updatePhoto(){
  io.emit('photo');
}

async function updateControl(ctrl: Control) {
  control = ctrl;
  io.emit('control', ctrl);
}
async function startupWifi(): Promise<boolean> {
  // Check if connected to internet
  await got('https://google.com').then(() => {
    gotInternet.ref = true;
  }).catch(() => {
    gotInternet.ref = false;
  });

  // Get current wifi connections
  const conns = await wifi.getStatus();

  // Get available connections
  const networks = wifi.getNetworks();

  // If we have no connections, we need wifi
  if(conns.length === 0 && !gotInternet.ref) {
    io.emit('need-wifi', networks);
    return true;
  } else { // Check that connection has internet
    return got('https://google.com').then(() => false).catch(() => {
      io.emit('need-wifi', networks);
      return true;
    });
  }
}

async function internetPing() {
  await got('https://google.com').then(async () => {
    // Emit connection if we didn't have internet before
    if(!gotInternet.ref) {
      console.log("Internet connected");
      io.emit('internet-connected');
    }
    // Update Global
    gotInternet.ref = true;
    // Run startup if we need to
    if(!startupComplete.ref) {
      await doStartup();
    }
  }).catch(() => {
    // Emit disconnection if we had internet before
    if(gotInternet.ref) {
      console.log("Lost internet");
      io.emit('internet-disconnected');
    }
    // Update global
    gotInternet.ref = false;
  });
}

async function doStartup() {
  needWifi.ref = await startupWifi();
  if(!needWifi.ref || gotInternet.ref) {
    await updateForecast(true);
    await updateWeather(true);
    await updateTime();
    await updatePhoto();
    await updateControl(control);
    startupComplete.ref = true;
    io.emit('startup-complete');
  }
}

// Check for internet now
internetPing();

// Set timout to ping for internet after being alive for 20 seconds
setTimeout(internetPing, 1000 * 20);

// Setup Cron Jobs

// Get Long/Lat and forecast every day at 12:00 AM
cron.schedule('0 0 * * *', () => updateForecast())

// Get Weather every 10 minutes
cron.schedule('*/10 * * * *', () => updateWeather())

// Emit time every second
cron.schedule('* * * * * *', updateTime);

// Update photo every 10 minutes
cron.schedule('*/10 * * * *', updatePhoto);

// Ping for internet every minute
cron.schedule('* * * * *', internetPing);


process.on('SIGTERM', () => {
  console.log('❌ Received SIGTERM, api closing...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('❌ Received SIGINT, api closing...');
  process.exit(0);
});

process.on('unhandledRejection', (reason, p) => {
  console.log(`⚠ Unhandled promise rejection thrown: `);
  console.log(reason);
});
