import { createSlice } from "@reduxjs/toolkit";


let authSlice = createSlice({
    name: "authentication",
    initialState: {
        user: null,
        isLoading: true,
        isAuthenticated: false
    },
    reducers: {
        addUser: (state, action) => {
            state.user = action.payload
            state.isLoading = false
            state.isAuthenticated = true
        }
    }
})

export let { addUser } = authSlice.actions

export default authSlice.reducer