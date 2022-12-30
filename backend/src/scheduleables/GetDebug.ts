import si from 'systeminformation';
import {getOwnIp} from "../IPAPI";
import DebugInfo from "../models/DebugInfo";

export default async function getDebug(longLat: {latitude: number, longitude: number}): Promise<DebugInfo> {
  // Fetch data
  const [interfaces, activeWifi, time, cpu, cpuTemperature, memory, publicIp] = await Promise.all([
    si.networkInterfaces(),
    si.wifiConnections(),
    si.time(),
    si.cpu(),
    si.cpuTemperature(),
    si.mem(),
    getOwnIp(),
  ]);
  const dInterfaces = interfaces.map((iface) => ({
      iface: iface.iface,
      iface_name: iface.ifaceName,
      ipv4: iface.ip4,
      ipv4_subnet: iface.ip4subnet,
      ipv6: iface.ip6,
      ipv6_subnet: iface.ip6subnet,
      mac: iface.mac,
      internal: iface.internal,
      dhcp: iface.dhcp,
    }));
  const dActiveWifi = activeWifi.map((wifi) => ({
    id: wifi.id,
    iface: wifi.iface,
    model: wifi.model,
    ssid: wifi.ssid,
    bssid: wifi.bssid,
    channel: wifi.channel,
    type: wifi.type,
    security: wifi.security,
    frequency: wifi.frequency,
    signal_level: wifi.signalLevel,
    tx_rate: wifi.txRate,
  }));

  return {
    interfaces: dInterfaces,
    active_wifi: dActiveWifi,
    system: {
      time: time.current,
      uptime: time.uptime / 3600, // hours
      timezone_name: time.timezoneName,
      timezone: time.timezone,
    },
    cpu: {
      current_speed: cpu.speed, // ghz
      current_temp: cpuTemperature.main,
    },
    memory: {
      total: memory.total / 1051648, // mb
      free: memory.free / 1051648, // mb
      used: memory.used / 1051648, // mb
    },
    locataion: {
      latitude: longLat.latitude,
      longitude: longLat.longitude,
    },
    public_ip: publicIp,
  }
}