import axios from "axios"

export let AxiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
})