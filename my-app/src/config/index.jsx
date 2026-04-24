

import axios from "axios";

export const BASE_URL = "http://localhost:9080/"

export const clientServer = axios.create({  // ye practice  me lao asse hi aur essay hi folder structue banao
    baseURL: BASE_URL
});
