import { createSlice } from "@reduxjs/toolkit"
import { getAllComments, getAllPosts, postComment } from "../../action/postAction"



const initialState = {
    posts: [],
    isError: false,
    postFetched: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    comments: [],
    postId: "",

}


const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: () => initialState,
        resetPostId: (state) => {
            state.postId = ""
        },

    },
    extraReducers: (builder) => {
        builder.addCase(getAllPosts.pending, (state) => {
            state.isLoading = true
            state.message = "Fetching All Posts"
        })
        builder.addCase(getAllPosts.fulfilled, (state, action) => {
            state.isLoading = false
            state.isError = false
            state.postFetched = true
            state.posts = action.payload.posts.reverse();
        })
        builder.addCase(getAllPosts.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })

        builder.addCase(getAllComments.fulfilled, (state, action) => {
            state.isLoading = false
            state.isError = false
            state.comments = action.payload.comments
            state.postId = action.payload.postId
        })
        builder.addCase(getAllComments.rejected, (state, action) => {
            state.postId = action.payload.postId
        })

        builder.addCase(postComment.pending, (state) => {
            state.isLoading = true
        })

        builder.addCase(postComment.fulfilled, (state) => {
            state.isLoading = false
        })

        builder.addCase(postComment.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })


    }
})

export const { resetPostId } = postSlice.actions

export default postSlice.reducer


