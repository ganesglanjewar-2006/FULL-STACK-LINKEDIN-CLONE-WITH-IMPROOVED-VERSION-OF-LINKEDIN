import React, { useEffect } from "react";
import DashBoardLayout from "@/layout/DashBoardLayout";
import UserLayout from "@/layout/UserLayout";
import { useDispatch, useSelector } from "react-redux";
import { getMyConnectionRequests, getConnectionsRequest, AcceptConnection } from "@/config/redux/action/authAction";
import styles from "./index.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function MyConnectionsPage() {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        dispatch(getMyConnectionRequests({ token }));
        dispatch(getConnectionsRequest({ token }));
    }, [dispatch]);

    const handleAccept = (requestId) => {
        dispatch(AcceptConnection({
            token: localStorage.getItem("token"),
            connectionId: requestId,
            action: "accept"
        }));
    };

    const handleDecline = (requestId) => {
        dispatch(AcceptConnection({
            token: localStorage.getItem("token"),
            connectionId: requestId,
            action: "decline"
        }));
    };

    // Received requests that are pending
    const pendingRequests = authState.connections?.filter(c => c.status_accepted === null) || [];

    // All accepted connections
    const connectionsReceived = authState.connections?.filter(c => c.status_accepted === true) || [];
    const connectionsSent = authState.connectionRequest?.filter(c => c.status_accepted === true) || [];

    return (
        <UserLayout>
            <DashBoardLayout>
                <div className={styles.container}>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Pending Invitations ({pendingRequests.length})</h2>
                        {pendingRequests.length === 0 ? (
                            <p className={styles.emptyState}>No pending invitations</p>
                        ) : (
                            <div className={styles.grid}>
                                {pendingRequests.map((request) => (
                                    <div key={request._id} className={styles.userCard}>
                                        <div className={styles.cardHeader} onClick={() => router.push(`/view_profile/${request.userId.username}`)}>
                                            <img 
                                                src={request.userId.profilePicture ? `${BASE_URL}${request.userId.profilePicture}` : "/images/default_profile.jpg"} 
                                                alt={request.userId.name} 
                                                className={styles.avatar}
                                            />
                                            <div className={styles.userInfo}>
                                                <h3>{request.userId.name}</h3>
                                                <p>@{request.userId.username}</p>
                                            </div>
                                        </div>
                                        <div className={styles.actions}>
                                            <button className={styles.acceptBtn} onClick={() => handleAccept(request._id)}>Accept</button>
                                            <button className={styles.declineBtn} onClick={() => handleDecline(request._id)}>Ignore</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Your Network</h2>
                        <div className={styles.grid}>
                            {connectionsReceived.map((request) => (
                                <div key={request._id} className={styles.userCard} onClick={() => router.push(`/view_profile/${request.userId.username}`)}>
                                    <div className={styles.cardHeader}>
                                        <img 
                                            src={request.userId.profilePicture ? `${BASE_URL}${request.userId.profilePicture}` : "/images/default_profile.jpg"} 
                                            alt={request.userId.name} 
                                            className={styles.avatar}
                                        />
                                        <div className={styles.userInfo}>
                                            <h3>{request.userId.name}</h3>
                                            <p>@{request.userId.username}</p>
                                        </div>
                                    </div>
                                    <button className={styles.messageBtn}>Message</button>
                                </div>
                            ))}
                            {connectionsSent.map((request) => (
                                <div key={request._id} className={styles.userCard} onClick={() => router.push(`/view_profile/${request.connectionId.username}`)}>
                                    <div className={styles.cardHeader}>
                                        <img 
                                            src={request.connectionId.profilePicture ? `${BASE_URL}${request.connectionId.profilePicture}` : "/images/default_profile.jpg"} 
                                            alt={request.connectionId.name} 
                                            className={styles.avatar}
                                        />
                                        <div className={styles.userInfo}>
                                            <h3>{request.connectionId.name}</h3>
                                            <p>@{request.connectionId.username}</p>
                                        </div>
                                    </div>
                                    <button className={styles.messageBtn}>Message</button>
                                </div>
                            ))}
                            {connectionsReceived.length === 0 && connectionsSent.length === 0 && (
                                <p className={styles.emptyState}>No connections yet. Start growing your network!</p>
                            )}
                        </div>
                    </section>
                </div>
            </DashBoardLayout>
        </UserLayout>
    );
}