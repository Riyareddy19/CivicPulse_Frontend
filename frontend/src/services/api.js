
import axios from "axios";

const api = axios.create({
  baseURL: "https://civicpulse-backend-2.onrender.com/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;