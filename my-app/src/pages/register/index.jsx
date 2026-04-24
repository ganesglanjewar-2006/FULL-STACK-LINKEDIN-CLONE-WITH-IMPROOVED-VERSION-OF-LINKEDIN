import React, { useState } from 'react';
import styles from "../login/style.module.css";
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { registerUser } from '@/config/redux/action/authAction';

export default function RegisterComponent() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const dispatch = useDispatch();

    const handleRegister = () => {
        if (!name || !username || !email || !password) {
            alert("All fields are required");
            return;
        }
        dispatch(registerUser({ name, username, email, password })).then((res) => {
            if (res.payload) {
                router.push("/dashboard");
            } else {
                alert("Registration Failed. User might already exist.");
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.cardContainer}>
                <div className={styles.cardContainer_left}>
                    <h1 className={styles.cardleft_heading}>Join ProConnect</h1>
                    <p className={styles.subtitle}>Make the most of your professional life. Start by creating an account.</p>
                    
                    <div className={styles.inputContainer}>
                        <input 
                            className={styles.inputField} 
                            placeholder="Full Name" 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input 
                            className={styles.inputField} 
                            placeholder="Username" 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
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
                            onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                        />
                        <button onClick={handleRegister} className={styles.buttonWithOutline}>
                            Agree & Join
                        </button>
                    </div>
                </div>
                
                <div className={styles.cardContainer_right}>
                    <h2>Already on ProConnect?</h2>
                    <p>Stay updated on your professional world and start connecting.</p>
                    <button className={styles.switchBtn} onClick={() => router.push("/login")}>
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}
