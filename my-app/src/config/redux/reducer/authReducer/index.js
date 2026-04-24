import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, loginUser, registerUser, getConnectionsRequest, getMyConnectionRequests, AcceptConnection } from "../../action/authAction";




//action har barr uper hota hai aur slice niche hota hai
//hum reducer me ContextAPi se bhi chal skte hai ,lekin hume sikhna tha isliye humne do reducer banaye




const initialState = {
    user: undefined,
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    isTokenThere: false,
    profileFetched: false,
    connections: [],
    connectionRequest: [],
    all_users: [],
    all_profiles_fetched: false,

}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "hello"
        },
        emptyMessage: (state) => {
            state.message = "";
            state.isSuccess = false;
            state.isError = false;
        },
        setTokenIsThere: (state) => {
            state.isTokenThere = true;
        },
        setTokenIsNotThere: (state) => {
            state.isTokenThere = false;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Knocking the door...";

            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = true;
                state.message = "Login is Successful"

            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message || action.payload || "Login Failed";
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Registering you...";
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.loggedIn = false;
                state.message = action.payload?.message || "Registration is Successfull,Please Login"
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload?.message || action.payload || "Registration Failed";
            })
            .addCase(getAboutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.profileFetched = true;
                state.user = action.payload;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.all_profiles_fetched = true;
                state.all_users = action.payload;

            })
            .addCase(getConnectionsRequest.fulfilled, (state, action) => {
                state.connections = action.payload;

            })
            .addCase(getConnectionsRequest.rejected, (state, action) => {
                state.message = action.payload;
            })
            .addCase(getMyConnectionRequests.fulfilled, (state, action) => {
                state.connectionRequest = action.payload;
            })
            .addCase(getMyConnectionRequests.rejected, (state, action) => {
                state.message = action.payload;
            })



    }
})


export const { reset, emptyMessage, setTokenIsNotThere, setTokenIsThere } = authSlice.actions;

export default authSlice.reducer;
