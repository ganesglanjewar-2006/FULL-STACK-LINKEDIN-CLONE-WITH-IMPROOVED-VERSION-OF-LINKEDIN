import React, { useEffect } from "react";
import DashBoardLayout from "@/layout/DashBoardLayout";
import UserLayout from "@/layout/UserLayout";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers, sendConnectionRequest } from "@/config/redux/action/authAction";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function DiscoverPage() {
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (!authState.all_profiles_fetched) {
            dispatch(getAllUsers());
        }
    }, [authState.all_profiles_fetched, dispatch]);

    const handleConnect = (e, userId) => {
        e.stopPropagation(); // Prevent navigating to profile
        dispatch(sendConnectionRequest({
            token: localStorage.getItem("token"),
            userId: userId
        }));
    };

    return (
        <UserLayout>
            <DashBoardLayout>
                <div className={styles.allUserProfile}>
                    <h1 className={styles.pageTitle}>Discover People</h1>
                    <div className={styles.usersGrid}>
                        {authState.all_profiles_fetched && authState.all_users && authState.all_users
                            .filter(user => user.userId?._id !== authState.user?.userId?._id) // Don't show self
                            .map((user) => (
                            <div onClick={() => { router.push(`/view_profile/${user.userId.username}`) }} key={user._id} className={styles.userCard}>
                                <div className={styles.imageContainer}>
                                    <img
                                        className={styles.userCard_image}
                                        src={user.userId?.profilePicture ? `${BASE_URL}${user.userId.profilePicture}` : "/images/default_profile.jpg"}
                                        alt={user.userId?.name || "User"}
                                    />
                                </div>
                                <div className={styles.userCard_info}>
                                    <p className={styles.userName}>{user.userId?.name || "Anonymous"}</p>
                                    <p className={styles.userUsername}>@{user.userId?.username || "user"}</p>
                                    <p className={styles.userBio}>{user.bio || "No bio available"}</p>
                                </div>
                                <button 
                                    className={styles.connectButton}
                                    onClick={(e) => handleConnect(e, user.userId._id)}
                                >
                                    Connect
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </DashBoardLayout>
        </UserLayout>
    );
}