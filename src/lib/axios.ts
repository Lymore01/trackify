import axios from "axios";
import { config } from "../../config/config.ts";

const axiosInstance = axios.create({
    baseURL: config.BASE_URL || "http://localhost:4030",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});


export default axiosInstance;