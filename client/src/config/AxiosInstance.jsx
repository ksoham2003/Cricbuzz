import axios from "axios"

export let AxiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true
})