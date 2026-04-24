import React, { useEffect } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { setTokenIsThere } from "@/config/redux/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";

import { BASE_URL } from "@/config";

export default function DashBoardLayout({ children }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            router.push("/login");
        }
        dispatch(setTokenIsThere());
    }, [dispatch, router]);

    const isPathActive = (path) => router.pathname === path;

    return (
        <div className={styles.homeContainer}>
            {/* Left Sidebar */}
            <aside className={styles.homeContainer_leftBar}>
                <div 
                    onClick={() => router.push("/dashboard")} 
                    className={`${styles.sideBarOption} ${isPathActive("/dashboard") ? styles.sideBarOptionActive : ""}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <span>Feed</span>
                </div>
                <div 
                    onClick={() => router.push("/discover")} 
                    className={`${styles.sideBarOption} ${isPathActive("/discover") ? styles.sideBarOptionActive : ""}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <span>Discover</span>
                </div>
                <div 
                    onClick={() => router.push("/my_connections")} 
                    className={`${styles.sideBarOption} ${isPathActive("/my_connections") ? styles.sideBarOptionActive : ""}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <span>Network</span>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {children}
            </main>

            {/* Right Sidebar (Optional, can be hidden on small screens) */}
            <aside className={styles.homeContainer_leftBar} style={{ flex: '0 0 280px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#1d1d1d' }}>Recent People</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {authState.all_profiles_fetched && Array.isArray(authState.all_users) && authState.all_users.slice(0, 5).map((profile) => (
                        profile.userId && (
                            <div 
                                key={profile._id} 
                                style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}
                                onClick={() => router.push(`/view_profile/${profile.userId.username}`)}
                            >
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f0f0f0', overflow: 'hidden' }}>
                                    {profile.userId.profilePicture && (
                                        <img src={`${BASE_URL}${profile.userId.profilePicture}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                    )}
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '600', margin: 0 }}>{profile.userId.name}</p>
                                    <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>@{profile.userId.username}</p>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </aside>
        </div>
    );
}