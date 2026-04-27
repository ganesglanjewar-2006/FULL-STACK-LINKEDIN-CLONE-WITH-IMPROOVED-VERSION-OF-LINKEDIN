

import axios from "axios";

export const BASE_URL = "https://proconnect-backend-apt9.onrender.com/"

export const clientServer = axios.create({  // ye practice  me lao asse hi aur essay hi folder structue banao
    baseURL: BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL
});
