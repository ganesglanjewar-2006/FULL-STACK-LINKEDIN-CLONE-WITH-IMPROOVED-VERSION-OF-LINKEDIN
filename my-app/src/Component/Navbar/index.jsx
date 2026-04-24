import React from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { reset } from '@/config/redux/reducer/authReducer'

function NavbarComponent() {
    const router = useRouter();
    const authState = useSelector((state) => state.auth)
    const dispatch = useDispatch();

    return (
        <div className={styles.container}>
            <nav className={styles.navBar}>
                <h1 className={styles.logo} onClick={() => {
                    router.push("/")
                }}>ProConnect</h1>

                <div className={styles.navBarOptionContainer}>
                    {authState.profileFetched && (
                        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                            <p className={styles.navLink} style={{ color: '#1d1d1d' }}>Hi, {authState.user?.userId?.name.split(' ')[0]}</p>
                            <p className={styles.navLink} onClick={() => {
                                router.push(`/profile`)
                            }} style={{ cursor: "pointer" }}>Profile</p>

                            <p className={styles.navLink} onClick={() => {
                                localStorage.removeItem("token")
                                router.push("/login")
                                dispatch(reset())
                            }} style={{ cursor: "pointer" }}>Logout</p>
                        </div>
                    )}

                    {!authState.profileFetched && (
                        <div onClick={() => {
                            router.push("/login")
                        }} className={styles.buttonJoin}>
                            <p>Join Now</p>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    )
}

export default NavbarComponent