import React, { useState } from 'react';
import styles from "./style.module.css";
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { loginUser } from '@/config/redux/action/authAction';

export default function LoginComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const dispatch = useDispatch();

    const handleLogin = () => {
        dispatch(loginUser({ email, password })).then((res) => {
            if (res.payload) {
                router.push("/dashboard");
            } else {
                alert("Invalid Credentials");
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.cardContainer}>
                <div className={styles.cardContainer_left}>
                    <h1 className={styles.cardleft_heading}>Welcome Back</h1>
                    <p className={styles.subtitle}>Don't miss your next opportunity. Sign in to stay updated on your professional world.</p>
                    
                    <div className={styles.inputContainer}>
                        <input 
                            className={styles.inputField} 
                            placeholder="Email" 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input 
                            className={styles.inputField} 
                            placeholder="Password" 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        />
                        <button onClick={handleLogin} className={styles.buttonWithOutline}>
                            Sign In
                        </button>
                        
                        <p style={{ textAlign: 'center', marginTop: '1rem', display: 'none' }} className={styles.mobileSwitch}>
                            New to ProConnect? <span style={{ color: '#0a66c2', fontWeight: '700', cursor: 'pointer' }} onClick={() => router.push("/register")}>Join now</span>
                        </p>
                    </div>
                </div>
                
                <div className={styles.cardContainer_right}>
                    <h2>New here?</h2>
                    <p>Register and start connecting with professionals around the world.</p>
                    <button className={styles.switchBtn} onClick={() => router.push("/register")}>
                        Join Now
                    </button>
                </div>
            </div>
        </div>
    );
}
