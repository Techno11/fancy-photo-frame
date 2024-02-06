import {io, Socket} from "socket.io-client";
import {EventEmitter} from "events"
import {Theme} from "../../models/SocketMessage";
import DebugInfo from "../../models/DebugInfo";

export default class SocketHelper {
  // private _path: string;
  private _socket: Socket;
  private _bgController: {weatherTheme: "snow" | "rain" | "clear" | "windy", greetingTheme: Theme}
  private _lastTime: Date = new Date(NaN);
  private _lastWeather: Date = new Date(NaN);
  private _lastForecast: Date = new Date(NaN);
  private _lastPhoto: Date = new Date(NaN);

  private _emitter = new EventEmitter();

  constructor(path: string) {
    // this._path = path;
    this._bgController = {weatherTheme: "clear", greetingTheme: Theme.day};

    // Setup socket
    this._socket = io(path, {autoConnect: false});

    // Setup events
    this._socket.on("connect", () => this._emitAll("socket", {type: "socket", connected: true}));
    this._socket.on("disconnect", () => this._emitAll("socket", {type: "socket", connected: false}));
    this._socket.on("error", () => this._emitAll("socket", {type: "socket", connected: false}));
    this._socket.on("reconnect", () => this._emitAll("socket", {type: "socket", connected: true}));

    // Custom Events
    const customEvents = ["weather", "forecast", "time", "control", "photo", "need-wifi", "connected-wifi", "wifi-failed", "internet-connected", "internet-disconnected", "startup-in-progress", "startup-complete"];
    customEvents.forEach(e => this._socket.on(e, data => {
      this._emitAll(e, data)
      if(e === "time" && this._bgController.greetingTheme !== data.greeting.theme) {
        this.setGreetingTheme(data.greeting.theme)
      } else if (e === "weather") {
        const id = data.type?.id ?? 900
        if(id >= 600 && id < 700 && this._bgController.weatherTheme !== "snow") {
          this.setWeatherTheme("snow");
        } else if(id >= 200 && id < 600 && this._bgController.weatherTheme !== "rain") {
          this.setWeatherTheme("rain");
        } else if(id >= 700 && id < 800 && this._bgController.weatherTheme !== "windy") {
          this.setWeatherTheme("windy");
        } else {
          this.setWeatherTheme("clear");
        }
      }

      // Store dates of last recieved messages
      if(e === "time") this._lastTime = new Date();
      else if(e === "weather") this._lastWeather = new Date();
      else if(e === "forecast") this._lastForecast = new Date();
      else if(e === "photo") this._lastPhoto = new Date();
    }

    ));

    // Connect socket
    this._socket.connect();
  }

  /**
   * Get if socket is connected
   */
  public isConnected(): boolean {
    return this._socket.connected;
  }

  /**
   * Request weather be sent
   */
  public getWeather() {
    this._socket.emit("get-weather");
  }

  /**
   * Request forecast be sent
   */
  public getForecast() {
    this._socket.emit("get-forecast");
  }

  /**
   * Request control message be sent
   */
  public getControl() {
    this._socket.emit("get-control");
  }

  /**
   * Request wifi status be sent
   */
  public getNeedWifi() {
    this._socket.emit("get-need-wifi");
  }

  /**
   * Get random photo
   */
  public getPhoto(): Promise<string> {
    this._lastPhoto = new Date();
    return fetch(`http://localhost:8008/api/randomPhoto`).then(res => res.blob()).then(blob => URL.createObjectURL(blob));
  }


  /**
   * Send signal to kill API (and technically systemd will restart it, hopefully)
   */
  public restartServer(): Promise<boolean> {
    return new Promise(resolve => {
      // Register a listener for ourselves on the reconnect event
      this._socket.once("connect", () => resolve(true));
      this._socket.emit("restart");
    })
  }

  /**
   * Add a listener to the status update
   */
  public addListener(event: string, cb: (...args: any[]) => void) {
    this._emitter.addListener(event, cb);
  }

  /**
   * Remove a listener for the board-update event
   */
  public removeListener(event: string, cb: (...args: any[]) => void) {
    this._emitter.removeListener(event, cb);
  }

  /**
   * Emit to all listeners
   * @param event event to emit
   * @param payload
   * @private
   */
  private _emitAll(event: string, payload: any) {
    this._emitter.emit(event, payload);
  }

  /**
   * Set Requested theme for weather
   */
  public setWeatherTheme(theme: "snow" | "rain" | "clear" | "windy") {
    this._bgController.weatherTheme = theme;
    this._emitAll("theme", this._bgController);
  }

  /**
   * Set Requested theme for greeting
   */
  public setGreetingTheme(theme: Theme) {
    this._bgController.greetingTheme = theme;
    this._emitAll("theme", this._bgController);
  }

  /**
   * Get requested themes
   */
  public getRequestedThemes() {
    return this._bgController;
  }

  /**
   * Connect to wifi
   */
  public connectWifi(ssid: string, password: string) {
    this._socket.emit("connect-wifi", {ssid, password});
  }

  /**
   * Force wifi dialog
   */
  public forceWifi() {
    this._socket.emit("force-wifi");
  }

  /**
   * Get internet status
   */
  public getGotInternet() {
    this._socket.emit("get-got-internet");
  }

  /**
   * Get Socket connection status
   */
  public getSocketStatus() {
    return this._socket.connected;
  }

  /** Get last time message received time */
  public getLastTime() {
    return this._lastTime;
  }

  /** Get last weather message received time */
  public getLastWeather() {
    return this._lastWeather;
  }

  /** Get last forecast message received time */
  public getLastForecast() {
    return this._lastForecast;
  }

  /** Get last photo message received time */
  public getLastPhoto() {
    return this._lastPhoto;
  }

  /** Get debug data */
  public async getDebugData(): Promise<DebugInfo> {
    return new Promise((resolve) => {
      this._socket.once("debug", resolve);
      this._socket.emit("get-debug");
    });
  }

  /** Forget a given SSID */
  public async forgetWifi(ssid: string) {
    this._socket.emit("forget-wifi", {ssid: ssid});
  }
}