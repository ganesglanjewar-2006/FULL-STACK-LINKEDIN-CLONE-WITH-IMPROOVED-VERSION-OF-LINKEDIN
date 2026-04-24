import React, { useEffect, useState } from "react";
import { clientServer, BASE_URL } from "@/config";
import UserLayout from "@/layout/UserLayout";
import DashBoardLayout from "@/layout/DashBoardLayout";
import styles from "./index.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { getAllPosts } from "@/config/redux/action/postAction";
import { getConnectionsRequest, getMyConnectionRequests, sendConnectionRequest } from "@/config/redux/action/authAction";

export default function ViewProfilePage({ userProfile }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const postReducer = useSelector((state) => state.postReducer);
    const authState = useSelector((state) => state.auth);

    const [userPosts, setUserPosts] = useState([]);
    const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);
    const [isConnectionPending, setIsConnectionPending] = useState(false);

    useEffect(() => {
        dispatch(getAllPosts());
        dispatch(getConnectionsRequest({ token: localStorage.getItem("token") }));
        dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
    }, [dispatch]);

    useEffect(() => {
        if (postReducer.posts && userProfile) {
            const filteredPosts = postReducer.posts.filter((post) =>
                post.userId?.username === userProfile.userId?.username
            );
            setUserPosts(filteredPosts);
        }
    }, [postReducer.posts, userProfile]);

    useEffect(() => {
        if (userProfile?.userId?._id && authState.user) {
            const receivedConnection = authState.connections?.find(c => c.userId?._id === userProfile.userId._id);
            const sentConnection = authState.connectionRequest?.find(c => c.connectionId?._id === userProfile.userId._id);
            const connection = receivedConnection || sentConnection;

            if (connection) {
                setIsCurrentUserInConnection(true);
                setIsConnectionPending(connection.status_accepted !== true);
            } else {
                setIsCurrentUserInConnection(false);
            }
        }
    }, [authState.connections, authState.connectionRequest, userProfile, authState.user]);

    if (!userProfile) {
        return (
            <UserLayout>
                <DashBoardLayout>
                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <h1>User Not Found</h1>
                        <button className={styles.connectBtn} onClick={() => router.push('/dashboard')}>Go Back</button>
                    </div>
                </DashBoardLayout>
            </UserLayout>
        );
    }

    return (
        <UserLayout>
            <DashBoardLayout>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <img
                            className={styles.profilePicture}
                            src={userProfile.userId?.profilePicture ? `${BASE_URL}${userProfile.userId.profilePicture}` : "/images/default_profile.jpg"}
                            alt={userProfile.userId?.name}
                        />
                    </div>
                    <div className={styles.info}>
                        <div className={styles.mainInfo}>
                            <div className={styles.nameRow}>
                                <h2>{userProfile.userId?.name}</h2>
                                <span className={styles.username}>@{userProfile.userId?.username}</span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                {isCurrentUserInConnection ? (
                                    <button className={styles.connectedButton}>
                                        {isConnectionPending ? "Pending" : "Connected"}
                                    </button>
                                ) : (
                                    <button className={styles.connectBtn} onClick={() => {
                                        dispatch(sendConnectionRequest({
                                            token: localStorage.getItem("token"),
                                            userId: userProfile.userId._id
                                        }));
                                    }}>
                                        Connect
                                    </button>
                                )}

                                <div
                                    style={{
                                        width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #0a66c2',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a66c2', cursor: 'pointer'
                                    }}
                                    onClick={async () => {
                                        const response = await clientServer.get(`/user/download_resume?user_id=${userProfile.userId._id}`);
                                        window.open(`${BASE_URL}${response.data.message}`, "_blank");
                                    }}
                                    title="Download Resume"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className={styles.bio}>
                            <p>{userProfile.bio}</p>
                        </div>

                        {userProfile.pastWork && userProfile.pastWork.length > 0 && (
                            <div className={styles.section}>
                                <h3>Work History</h3>
                                <div className={styles.grid}>
                                    {userProfile.pastWork.map((work, index) => (
                                        <div key={index} className={styles.card}>
                                            <h4>{work.company}</h4>
                                            <p>{work.position}</p>
                                            <p>{work.years}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className={styles.section}>
                            <h3>Recent Activity</h3>
                            <div className={styles.grid} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                                {userPosts.map((post) => (
                                    <div key={post._id} style={{ borderRadius: '8px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                                        {post.media && (
                                            <img src={`${BASE_URL}${post.media}`} alt="" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                                        )}
                                        <div style={{ padding: '10px' }}>
                                            <p style={{ fontSize: '0.85rem', color: '#444' }}>{post.body}</p>
                                        </div>
                                    </div>
                                ))}
                                {userPosts.length === 0 && <p style={{ color: "#999", fontSize: "0.9rem" }}>No recent posts</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </DashBoardLayout>
        </UserLayout>
    );
}

export async function getServerSideProps(context) {  //site rendering ke liye
    const { username } = context.query;
    try {
        const request = await clientServer.get("/user/get_profile_based_on_username", {
            params: { username }
        });
        return {
            props: { userProfile: request.data.profile || null }
        };
    } catch (error) {
        return {
            props: { userProfile: null }
        };
    }
}
