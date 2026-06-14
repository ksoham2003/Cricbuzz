import { createSlice } from "@reduxjs/toolkit";

let authSlice = createSlice({
    name: "authentication",
    initialState: {
        user: null,
        isLoading: true,
        isAuthenticated: false,
        error: null
    },
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload
            state.isLoading = false
            state.isAuthenticated = true
            state.error = null
        },
        logoutUser: (state) => {
            state.user = null
            state.isLoading = false
            state.isAuthenticated = false
            state.error = null
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
            state.isLoading = false
        },
        clearError: (state) => {
            state.error = null
        }
    }
})

export let { addUser, logoutUser, setLoading, setError, clearError } = authSlice.actions

export default authSlice.reducer