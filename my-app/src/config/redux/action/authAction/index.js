import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "../../../index.jsx";



export const loginUser = createAsyncThunk(
    "user/login",

    async (user, thunkAPI) => {

        try {

            const response = await clientServer.post("/login", {
                email: user.email,
                password: user.password

            });  //agr axios se likte to http:// pura linkha padta aur jab change krne ki bari ati to sab jgh chnage krna pdta to bohot mushkil ho jati "axios" isliye hum aassa lik rhe hai

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);

            } else {
                return thunkAPI.rejectWithValue({
                    message: "token not provided"
                }
                );
            }
            return thunkAPI.fulfillWithValue(response.data.token);

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }

    }

)


export const registerUser = createAsyncThunk(
    "user/register",

    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/register", {
                username: user.username,
                password: user.password,
                email: user.email,
                name: user.name,


            });
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }

)

export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get("/get_user_and_profile",
                { params: { token: user.token } }  //params kyuki get request hai
            );
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }

    }
)

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get("/user/get_all_users");
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",

    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/user/send_connection_request", {
                token: user.token,
                connectionId: user.userId,
            });
            thunkAPI.dispatch(getMyConnectionRequests({
                token: user.token,
            }));
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.message);
        }

    }


)

export const getConnectionsRequest = createAsyncThunk(
    "user/getConnectionsRequests",

    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/user/getConnectionRequest", {
                token: user.token
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const getMyConnectionRequests = createAsyncThunk(
    "user/getMyConnectionsRequests",

    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/user/getMyConnectionRequests", {
                token: user.token
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const AcceptConnection = createAsyncThunk(
    "user/AcceptConnection",

    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("/user/accept_connection_request", {
                token: user.token,
                requestId: user.connectionId,
                action_type: user.action,
            });
            thunkAPI.dispatch(getConnectionsRequest({ token: user.token }));
            thunkAPI.dispatch(getMyConnectionRequests({ token: user.token }));
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.message);
        }

    }
)

export const updateProfileData = createAsyncThunk(
    "user/updateProfileData",
    async (data, thunkAPI) => {
        try {
            const response = await clientServer.post("/update_profile_data", {
                token: localStorage.getItem("token"),
                ...data
            });
            thunkAPI.dispatch(getAboutUser({ token: localStorage.getItem("token") }));
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const updateUserData = createAsyncThunk(
    "user/updateUserData",
    async (data, thunkAPI) => {
        try {
            const response = await clientServer.post("/user_update", {
                token: localStorage.getItem("token"),
                ...data
            });
            thunkAPI.dispatch(getAboutUser({ token: localStorage.getItem("token") }));
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)