import { useForm } from "react-hook-form"
import { registerApi } from "../api/AuthApi"

let AuthHook = () => {
    let { register, reset, handleSubmit, formState: { errors }, watch } = useForm({
        mode: "onChange",
    })
    const password = watch("password")

    let loginSubmit = (data) => {
        console.log("this is data", data)
        console.log("login successfully")
        reset()
    }

    let registerSubmit = (data) => {
        registerApi(data)
        console.log("register successfully")
        reset()
    }

    return { register, reset, handleSubmit, errors, loginSubmit, registerSubmit, password }
}

export default AuthHook
