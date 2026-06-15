import { AxiosInstance } from "../../../config/AxiosInstance"


export let registerApi = async (data) => {
    let res = await AxiosInstance.post("/auth/register", data)
    return res.data.data.user
}

export let loginApi = async (data) => {
    let res = await AxiosInstance.post("/auth/login", data)
    return res.data.data.user
}


export let loginWithGoogle = async () => {
    window.location.href = "http://localhost:8000/api/auth/google";
}