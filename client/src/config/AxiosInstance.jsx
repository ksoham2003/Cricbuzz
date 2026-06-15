import axios from "axios"

export let AxiosInstance = axios.create({
    baseURL: "https://cricbuzz-wrdx.onrender.com/api",
    withCredentials: true
})