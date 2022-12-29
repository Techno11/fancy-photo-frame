import got from "got";

const key = "6793c2428de0c69830d0acbfd46e49ce";
const baseUrl = "http://api.ipstack.com/"

const getLongLat = async () => {
  const ip = await getOwnIp();
  const data = await got.get(`${baseUrl}${ip}?access_key=${key}`).json<{latitude: number, longitude: number}>();
  return {
    latitude: data.latitude,
    longitude: data.longitude,
  }
}

const getOwnIp = async () => {
  // Get my public IP
  const data = await got.get("https://api.ipify.org?format=json").json<{ip: string}>();
  return data.ip;
}

export default getLongLat;