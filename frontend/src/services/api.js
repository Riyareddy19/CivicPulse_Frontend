
// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://civicpulse-backend-2.onrender.com/api",
//   headers: {
//     "Content-Type": "application/json"
//   }
// });

// export default api;



import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://civicpulse-backend-2.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

export default api;
