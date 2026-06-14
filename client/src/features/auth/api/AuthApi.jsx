import { AxiosInstance } from "../../../config/AxiosInstance"


export let registerApi = async (data) => {
    let res = await AxiosInstance.post("/auth/register", data)
    console.log("register successfully and this is res--->", res)
}