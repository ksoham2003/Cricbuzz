import { useForm } from "react-hook-form"

let AuthHook = () => {
    let { register, reset, handleSubmit, formState: { errors }, watch } = useForm({
        mode: "onChange",
    })
    const password = watch("password")

    let loginSubmit = (data) => {
        data.preventDefault()
        console.log("this is data", data)
        console.log("login successfully")
        reset()
    }

    let registerSubmit = (data) => {
        data.preventDefault()
        console.log("this is data", data)
        console.log("login successfully")
        reset()
    }

    return { register, reset, handleSubmit, errors, loginSubmit, registerSubmit, password }
}

export default AuthHook
