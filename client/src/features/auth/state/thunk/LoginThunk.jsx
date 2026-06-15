import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "../../api/AuthApi";


export let logInThunk = createAsyncThunk("auth/login", async (data, thunkAPi) => {
    try {
        let res = await loginApi(data)

        return res
    }
    catch (err) {
        return thunkAPi.rejectWithValue("error in thunk api->", err)
    }
})