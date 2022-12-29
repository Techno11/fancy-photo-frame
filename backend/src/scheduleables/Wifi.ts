import wifi from 'node-wifi';

class PiWifi {

  constructor() {
    wifi.init({
      iface: null // network interface, choose a random wifi interface if set to null
    });
  }

  public getStatus = async () => {
    return wifi.getCurrentConnections()
  }

  public getNetworks = async () => {
    return wifi.scan();
  }

  public connect = async (ssid: string, password?: string) => {
    return wifi.connect({ ssid, password: password ?? '' })
  }

  public disconnect = async () => {
    return wifi.disconnect();
  }

  public deleteConnection = async (ssid: string) => {
    return wifi.deleteConnection({ ssid });
  }
}

export default PiWifi;