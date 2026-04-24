import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "../../../index.jsx";







export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get("/posts");
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }

    }
)

export const createPost = createAsyncThunk(
    "post/createPost",
    async (userData, thunkAPI) => {
        const { file, body } = userData;

        try {
            const formData = new FormData();
            formData.append("token", localStorage.getItem("token"));
            formData.append("body", body);
            formData.append("media", file);

            const response = await clientServer.post("/post", formData);

            if (response.status === 200) {
                thunkAPI.dispatch(getAllPosts());
                return thunkAPI.fulfillWithValue("Post Uploaded");
            }
            else {
                return thunkAPI.rejectWithValue("Failed to Upload Post");
            }
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || "Something went wrong");
        }

    }

)


export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (postId, thunkAPI) => {
        try {
            const response = await clientServer.delete(`/delete_post`, {
                data: {
                    token: localStorage.getItem("token"),
                    postId: postId.postId
                }
            });

            if (response.status === 200) {
                thunkAPI.dispatch(getAllPosts());
                return thunkAPI.fulfillWithValue(response.data);
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)
export const incrementPostLike = createAsyncThunk(
    "post/incrementPostLike",
    async (postId, thunkAPI) => {
        try {
            const response = await clientServer.post(`/increment_post_like`, {
                postId: postId.postId
            });

            if (response.status === 200) {
                thunkAPI.dispatch(getAllPosts());
                return thunkAPI.fulfillWithValue(response.data);
            }

        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }


)


export const getAllComments = createAsyncThunk(
    "post/getAllComments",
    async (postData, thunkAPI) => {
        try {
            const response = await clientServer.get(`/get_comments/${postData.postId}`);
            return thunkAPI.fulfillWithValue({
                comments: response.data,
                postId: postData.postId
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const postComment = createAsyncThunk(
    "post/postComment",
    async (commentData, thunkAPI) => {
        try {
            console.log({
                postId: commentData.postId,
                body: commentData.body
            })
            const response = await clientServer.post("/comment", {
                token: localStorage.getItem("token"),
                postId: commentData.postId,
                commentBody: commentData.body
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue("Something went wrong");
        }
    }
)