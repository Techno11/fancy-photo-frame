export interface WiFiNetwork {
  ssid: string;
  bssid?: string;
  mac?: string; // equals to bssid (for retrocompatibility)
  channel: number;
  frequency: number; // in MHz
  signal_level: number; // in dB
  quality: number; // same as signal level but in %
  security: string; // format depending on locale for open networks in Windows
  security_flags: string[]; // encryption protocols (format currently depending of the OS)
  mode?: string; // network mode like Infra (format currently depending of the OS)
}

export default WiFiNetwork;