import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/state/slice/AuthSlice"


let store = configureStore({
    reducer: {
        auth: authReducer,
    }
})