import { createSlice } from "@reduxjs/toolkit";
import { logInThunk } from "../thunk/LoginThunk";


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
    },
    extraReducers: (builder) => {
        builder
            .addCase(logInThunk.pending, (state) => {
                state.isLoading = true
                state.isAuthenticated = false
            })
            .addCase(logInThunk.fulfilled, (state, action) => {
                state.user = action.payload
                state.isAuthenticated = true
                state.isLoading = false
            })
            .addCase(logInThunk.rejected, (state) => {
                console.log("extraReducers me reject hit hua hai");
                state.isLoading = false;
                state.isAuthenticated = false
            })
    }
})

let { addUser } = authSlice.actions

export default authSlice.reducer