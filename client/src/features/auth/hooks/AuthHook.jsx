import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { registerApi, loginApi, logoutApi } from "../api/AuthApi"
import { addUser, logoutUser, setLoading, setError, clearError } from "../state/slice/AuthSlice"

let AuthHook = () => {
    let dispatch = useDispatch()
    let navigate = useNavigate()
    let { user, isLoading, isAuthenticated, error } = useSelector((state) => state.auth)

    let { register, reset, handleSubmit, formState: { errors }, watch } = useForm({
        mode: "onChange",
    })
    const password = watch("password")

    let loginSubmit = async (data) => {
        try {
            dispatch(setLoading(true))
            dispatch(clearError())
            let userData = await loginApi(data)
            dispatch(addUser(userData))
            reset()
            navigate("/dashboard")
        } catch (err) {
            let errMsg = err.response?.data?.message || err.message || "Failed to log in"
            dispatch(setError(errMsg))
        }
    }

    let registerSubmit = async (data) => {
        try {
            dispatch(setLoading(true))
            dispatch(clearError())
            // Remove confirmPassword before sending to backend
            const registerData = { ...data }
            delete registerData.confirmPassword
            let userData = await registerApi(registerData)
            dispatch(addUser(userData))
            reset()
            navigate("/dashboard")
        } catch (err) {
            let errMsg = err.response?.data?.message || err.message || "Failed to register"
            dispatch(setError(errMsg))
        }
    }

    let logout = async () => {
        try {
            dispatch(setLoading(true))
            await logoutApi()
        } catch (err) {
            console.error("Logout failed on server, cleaning local session", err)
        } finally {
            dispatch(logoutUser())
            navigate("/")
        }
    }

    return {
        register,
        reset,
        handleSubmit,
        errors,
        loginSubmit,
        registerSubmit,
        logout,
        password,
        user,
        isLoading,
        isAuthenticated,
        error,
        clearError: () => dispatch(clearError())
    }
}

export default AuthHook
