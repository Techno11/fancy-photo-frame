type DebugInfo = {
  interfaces: DebugNetworkInterface[],
  active_wifi: DebugActiveWifi[],
  system: DebugSystem,
  cpu: DebugCpu,
  memory: DebugMemory,
  locataion: DebugLocation,
  public_ip: string,
}


type DebugNetworkInterface = {
  iface: string,
  iface_name: string,
  ipv4: string,
  ipv4_subnet: string,
  ipv6: string,
  ipv6_subnet: string,
  mac: string,
  internal: boolean,
  dhcp: boolean,
}

type DebugActiveWifi = {
  id: string;
  iface: string;
  model: string;
  ssid: string;
  bssid: string;
  channel: number;
  type: string;
  security: string;
  frequency: number;
  signal_level: number;
  tx_rate: number;
}

type DebugSystem = {
  time: number,
  uptime: number,
  timezone: string,
  timezone_name: string,
}

type DebugCpu = {
  current_speed: number,
  current_temp: number,
}

type DebugMemory = {
  total: number,
  free: number,
  used: number,
}

type DebugLocation = {
  latitude: number,
  longitude: number,
}

export type LocalDebugInfo = { last_time: Date, last_weather: Date, last_forecast: Date, last_photo: Date, socket_connected: string }

export default DebugInfo;

