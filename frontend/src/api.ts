import axios from "axios";

const API = axios.create({
  baseURL: "https://lead-dashboard-backend-edjs.onrender.com",
});

export default API;