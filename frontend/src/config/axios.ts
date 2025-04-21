import axios from "axios";

const token = localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    Authorization: token ? `Bearer ${token}` : null,
  },
});

export default axiosInstance;
