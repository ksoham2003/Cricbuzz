import { createSlice } from "@reduxjs/toolkit";


let authSlice = createSlice({
    name: "authentication",
    initialState: {
        user: null,
        isLoading: true,
        isAuthenticated: false
    },
    reducers: {
        addUser: (state, payload) => {
            state.user = isAction.payload
            state.isLoading = false
            isAuthenticated = true
        }
    }
})

let { addUser } = authSlice.actions

export default authSlice.reducer