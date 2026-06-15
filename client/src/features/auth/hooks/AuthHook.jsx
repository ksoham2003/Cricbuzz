import { useForm } from "react-hook-form"
import { loginApi, registerApi } from "../api/AuthApi"

let AuthHook = () => {
    let { register, reset, handleSubmit, formState: { errors }, watch } = useForm({
        mode: "onChange",
    })
    const password = watch("password")

    let loginSubmit = async (data) => {
        let user = await loginApi(data)
        console.log("user", user)
        reset()
    }

    let registerSubmit = async (data) => {
        let user = await registerApi(data)
        console.log("user-->", user)
        reset()
    }

    return { register, reset, handleSubmit, errors, loginSubmit, registerSubmit, password }
}

export default AuthHook
