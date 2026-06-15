import { useForm } from "react-hook-form"
import { loginApi, registerApi } from "../api/AuthApi"
import { useDispatch } from "react-redux"
import { logInThunk } from "../state/thunk/LoginThunk"

let AuthHook = () => {
    let { register, reset, handleSubmit, formState: { errors }, watch } = useForm({
        mode: "onChange",
    })
    const password = watch("password")
    let dispatch = useDispatch()

    let loginSubmit = async (data) => {
        dispatch(logInThunk(data))
        console.log("user logged in")
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
