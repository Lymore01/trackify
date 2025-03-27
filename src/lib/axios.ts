import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.BASE_URL || "http://localhost:4030",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});


export default axiosInstance;