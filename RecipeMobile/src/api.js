import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// YOUR PC's IP address + backend port
const API = axios.create({
  baseURL: "http://10.81.172.209:4000/api",
  timeout: 10000,
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;