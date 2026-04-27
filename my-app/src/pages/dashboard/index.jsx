import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { 
    createPost, 
    getAllPosts, 
    deletePost, 
    incrementPostLike, 
    getAllComments, 
    postComment 
} from "../../config/redux/action/postAction";
import { getAboutUser, getAllUsers } from "../../config/redux/action/authAction";
import UserLayout from "@/layout/UserLayout";
import DashBoardLayout from "@/layout/DashBoardLayout";
import styles from "./index.module.css";
import { BASE_URL } from "../../config";
import { resetPostId } from "@/config/redux/reducer/postReducer";

export default function Dashboard() {
    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const postState = useSelector((state) => state.postReducer);

    const [postContent, setPostContent] = useState("");
    const [fileContent, setFileContent] = useState(null);
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        if (authState.isTokenThere) {
            dispatch(getAllPosts());
            dispatch(getAboutUser({ token: localStorage.getItem("token") }));
        }
        if (!authState.all_profiles_fetched) {
            dispatch(getAllUsers());
        }
    }, [authState.isTokenThere, dispatch]);

    const handleUpload = async () => {
        if (!postContent.trim() && !fileContent) return;
        await dispatch(createPost({ file: fileContent, body: postContent }));
        setPostContent("");
        setFileContent(null);
        dispatch(getAllPosts());
    };

    const handleCommentSubmit = async () => {
        if (!commentText.trim()) return;
        await dispatch(postComment({
            postId: postState.postId,
            body: commentText
        }));
        setCommentText("");
        dispatch(getAllComments({ postId: postState.postId }));
    };

    if (!authState.user) {
        return (
            <UserLayout>
                <DashBoardLayout>
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <p>Loading your feed...</p>
                    </div>
                </DashBoardLayout>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <DashBoardLayout>
                <div className={styles.scrollComponent}>
                    <div className={styles.wrapper}>
                        {/* Create Post Section */}
                        <div className={styles.createPostContainer}>
                            <img 
                                className={styles.userProfile} 
                                src={`${BASE_URL}${authState.user?.userId?.profilePicture || "default.jpg"}`} 
                                alt="" 
                            />
                            <textarea 
                                onChange={(e) => setPostContent(e.target.value)} 
                                value={postContent} 
                                placeholder="Start a post..." 
                                className={styles.textAreaOfContent}
                            />
                            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                                <label htmlFor="fileUpload" style={{ cursor: 'pointer', color: '#0a66c2' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="28">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                    </svg>
                                </label>
                                <input onChange={(e) => setFileContent(e.target.files[0])} type="file" hidden id="fileUpload" />
                                {(postContent.length > 0 || fileContent) && (
                                    <button onClick={handleUpload} className={styles.uploadButton}>
                                        Post
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Posts Feed */}
                        <div className={styles.postsContainer}>
                            {postState.posts.map((post) => (
                                <div key={post._id} className={styles.singleCard} style={{ marginBottom: '1rem' }}>
                                    <div className={styles.singleCard_profileContainer}>
                                        <img src={`${BASE_URL}${post.userId?.profilePicture || "default.jpg"}`} alt="" />
                                        <div className={styles.postInfo} style={{ flex: 1 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
                                                <h4 onClick={() => router.push(`/${post.userId?.username}`)} style={{ cursor: 'pointer' }}>
                                                    {post.userId?.name}
                                                </h4>
                                                {post.userId?._id === authState.user?.userId?._id && (
                                                    <div onClick={() => dispatch(deletePost({ postId: post._id }))} style={{ cursor: "pointer", color: '#ff4444' }}>
                                                        <svg style={{ width: "20px" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <p>@{post.userId?.username}</p>
                                        </div>
                                    </div>

                                    <div className={styles.postBody}>
                                        {post.body}
                                    </div>

                                    {post.media && (
                                        <div className={styles.singleCard_image}>
                                            <img src={`${BASE_URL}${post.media}`} alt="" />
                                        </div>
                                    )}

                                    <div className={styles.optionContainer}>
                                        <div onClick={() => dispatch(incrementPostLike({ postId: post._id }))} className={styles.singleOption_optionsContainer}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                            </svg>
                                            <span>{post.likes} Likes</span>
                                        </div>
                                        <div onClick={() => dispatch(getAllComments({ postId: post._id }))} className={styles.singleOption_optionsContainer}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                            </svg>
                                            <span>Comment</span>
                                        </div>
                                        <div onClick={() => {
                                            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.body)}&url=${encodeURIComponent(window.location.href)}`;
                                            window.open(twitterUrl, "_blank");
                                        }} className={styles.singleOption_optionsContainer}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                            </svg>
                                            <span>Share</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Comments Modal */}
                {postState.postId !== "" && (
                    <div onClick={() => dispatch(resetPostId())} className={styles.commentsContainer}>
                        <div onClick={(e) => e.stopPropagation()} className={styles.allCommentsContainer}>
                            <div className={styles.commentsHeader}>
                                <h2>Comments</h2>
                                <div style={{ cursor: 'pointer', fontSize: '1.5rem' }} onClick={() => dispatch(resetPostId())}>&times;</div>
                            </div>
                            <div className={styles.commentsList}>
                                {postState.comments.length === 0 && (
                                    <p style={{ textAlign: "center", color: "#666", marginTop: "2rem" }}>No comments yet. Be the first to comment!</p>
                                )}
                                {postState.comments.map((comment, index) => (
                                    <div key={index} className={styles.singleComment}>
                                        <img 
                                            className={styles.singleComment_userProfile} 
                                            src={`${BASE_URL}${comment.userId?.profilePicture || "default.jpg"}`} 
                                            alt="" 
                                        />
                                        <div className={styles.singleComment_content}>
                                            <p className={styles.singleComment_userName}>{comment.userId?.name}</p>
                                            <p style={{ fontSize: '0.8rem', color: '#0a66c2', margin: '-2px 0 4px' }}>@{comment.userId?.username}</p>
                                            <p className={styles.singleComment_body}>{comment.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.postCommentContainer}>
                                <input 
                                    type="text" 
                                    value={commentText} 
                                    onChange={(e) => setCommentText(e.target.value)} 
                                    placeholder="Add a comment..." 
                                    onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                                />
                                <button onClick={handleCommentSubmit} className={styles.postCommentContainer_commentBtn}>
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </DashBoardLayout>
        </UserLayout>
    );
}