import { getAboutUser, updateProfileData, updateUserData } from '@/config/redux/action/authAction';
import DashBoardLayout from '@/layout/DashBoardLayout';
import UserLayout from '@/layout/UserLayout';
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.css'
import { BASE_URL, clientServer } from '@/config';
import { getAllPosts } from '@/config/redux/action/postAction';
import ProfileModal from '@/Component/ProfileModal/ProfileModal';

function ProfilePage() {
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.postReducer);

    const [userProfile, setUserProfile] = useState({});
    const [originalProfile, setOriginalProfile] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [isDirty, setIsDirty] = useState(false);
    
    const [showWorkModal, setShowWorkModal] = useState(false);
    const [showEduModal, setShowEduModal] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
        dispatch(getAllPosts());
    }, [dispatch]);

    useEffect(() => {
        if (authState.user) {
            const profileData = {
                name: authState.user.userId?.name || "",
                bio: authState.user.bio || "",
                curentPost: authState.user.curentPost || "",
                pastWork: authState.user.pastWork || [],
                education: authState.user.education || []
            };
            setUserProfile(profileData);
            setOriginalProfile(profileData);

            const filteredPosts = postReducer.posts.filter((post) => 
                post.userId?.username === authState.user.userId?.username
            );
            setUserPosts(filteredPosts);
        }
    }, [authState.user, postReducer.posts]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...userProfile, [name]: value };
        setUserProfile(updated);
        
        // Check if actually changed
        const hasChanged = 
            updated.name !== originalProfile.name || 
            updated.bio !== originalProfile.bio ||
            updated.curentPost !== originalProfile.curentPost;
        setIsDirty(hasChanged);
    };

    const handleUpdateProfile = async () => {
        if (userProfile.name !== originalProfile.name) {
            await dispatch(updateUserData({ name: userProfile.name }));
        }
        if (userProfile.bio !== originalProfile.bio || userProfile.curentPost !== originalProfile.curentPost) {
            await dispatch(updateProfileData({ 
                bio: userProfile.bio,
                curentPost: userProfile.curentPost
            }));
        }
        setIsDirty(false);
        setOriginalProfile(userProfile);
    };

    const updateProfilePicture = async (file) => {
        const formData = new FormData();
        formData.append("profile_picture", file);
        formData.append("token", localStorage.getItem("token"));

        try {
            await clientServer.post("/update_profile_picture", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            dispatch(getAboutUser({ token: localStorage.getItem("token") }));
        } catch (err) {
            console.error("Error updating profile picture", err);
        }
    }

    const handleAddWork = async (workData) => {
        const updatedWork = [...userProfile.pastWork, workData];
        await dispatch(updateProfileData({ pastWork: updatedWork }));
        setShowWorkModal(false);
    };

    const handleAddEducation = async (eduData) => {
        const updatedEdu = [...userProfile.education, eduData];
        await dispatch(updateProfileData({ education: updatedEdu }));
        setShowEduModal(false);
    };

    if (!authState.user) return null;

    return (
        <UserLayout>
            <DashBoardLayout>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.profilePicContainer} onClick={() => fileInputRef.current.click()}>
                            <img
                                className={styles.profilePicture}
                                src={`${BASE_URL}${authState.user.userId?.profilePicture || "default.jpg"}`}
                                alt={userProfile.name}
                            />
                            <div className={styles.profilePicOverlay}>
                                <span className={styles.editIcon}>📷</span>
                                <span>Edit Profile</span>
                            </div>
                        </div>
                        <input 
                            hidden 
                            type="file" 
                            ref={fileInputRef}
                            onChange={(e) => updateProfilePicture(e.target.files[0])} 
                        />
                    </div>

                    <div className={styles.info}>
                        <div className={styles.mainInfo}>
                            <div className={styles.editableFields}>
                                <h1
                                    contentEditable
                                    onBlur={(e) => handleInputChange({ target: { name: "name", value: e.target.innerText } })}
                                    onInput={() => setIsDirty(true)}
                                    suppressContentEditableWarning
                                    className={styles.profileName}
                                >
                                    {userProfile.name}
                                </h1>
                                <h2
                                    contentEditable
                                    onBlur={(e) => handleInputChange({ target: { name: "curentPost", value: e.target.innerText } })}
                                    onInput={() => setIsDirty(true)}
                                    suppressContentEditableWarning
                                    className={styles.profilePosition}
                                >
                                    {userProfile.curentPost || "Professional Title"}
                                </h2>
                                <span className={styles.username}>@{authState.user.userId?.username}</span>
                                <p
                                    contentEditable
                                    onBlur={(e) => handleInputChange({ target: { name: "bio", value: e.target.innerText } })}
                                    onInput={() => setIsDirty(true)}
                                    suppressContentEditableWarning
                                    className={styles.profileBio}
                                >
                                    {userProfile.bio}
                                </p>
                            </div>
                            {isDirty && (
                                <button className={styles.updateBtn} onClick={handleUpdateProfile}>
                                    Update Profile
                                </button>
                            )}
                            <div 
                                className={styles.downloadIcon} 
                                onClick={async () => {
                                    const response = await clientServer.get(`/user/download_resume?user_id=${authState.user.userId._id}`);
                                    window.open(`${BASE_URL}${response.data.message}`, "_blank");
                                }}
                                title="Download Resume"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h3>Work History</h3>
                                <button className={styles.addBtn} onClick={() => setShowWorkModal(true)}>
                                    <span>+</span> Add Work
                                </button>
                            </div>
                            <div className={styles.grid}>
                                {userProfile.pastWork?.map((work, index) => (
                                    <div key={index} className={styles.card}>
                                        <h4>{work.company}</h4>
                                        <p>{work.position}</p>
                                        <p>{work.years}</p>
                                    </div>
                                ))}
                                {(!userProfile.pastWork || userProfile.pastWork.length === 0) && (
                                    <p style={{ color: "#999" }}>No work history added yet.</p>
                                )}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h3>Education</h3>
                                <button className={styles.addBtn} onClick={() => setShowEduModal(true)}>
                                    <span>+</span> Add Education
                                </button>
                            </div>
                            <div className={styles.grid}>
                                {userProfile.education?.map((edu, index) => (
                                    <div key={index} className={styles.card}>
                                        <h4>{edu.school}</h4>
                                        <p>{edu.degree} - {edu.fieldOfStudy}</p>
                                    </div>
                                ))}
                                {(!userProfile.education || userProfile.education.length === 0) && (
                                    <p style={{ color: "#999" }}>No education added yet.</p>
                                )}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h3>Recent Activity</h3>
                            </div>
                            <div className={styles.activityGrid}>
                                {userPosts.map((post) => (
                                    <div key={post._id} className={styles.postCard}>
                                        <div className={styles.postMedia}>
                                            {post.media ? (
                                                <img src={`${BASE_URL}${post.media}`} alt="" />
                                            ) : (
                                                <div style={{ background: "#f0f0f0", height: "100%" }} />
                                            )}
                                        </div>
                                        <div className={styles.postContent}>
                                            <p>{post.body}</p>
                                        </div>
                                    </div>
                                ))}
                                {userPosts.length === 0 && (
                                    <p style={{ color: "#999" }}>No recent activity to show.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {showWorkModal && (
                    <ProfileModal 
                        title="Add Work Experience"
                        fields={[
                            { name: "company", label: "Company", placeholder: "e.g. Google" },
                            { name: "position", label: "Position", placeholder: "e.g. Software Engineer" },
                            { name: "years", label: "Years", placeholder: "e.g. 2020 - 2023" }
                        ]}
                        onSave={handleAddWork}
                        onClose={() => setShowWorkModal(false)}
                    />
                )}

                {showEduModal && (
                    <ProfileModal 
                        title="Add Education"
                        fields={[
                            { name: "school", label: "School/University", placeholder: "e.g. MIT" },
                            { name: "degree", label: "Degree", placeholder: "e.g. Bachelor's" },
                            { name: "fieldOfStudy", label: "Field of Study", placeholder: "e.g. Computer Science" }
                        ]}
                        onSave={handleAddEducation}
                        onClose={() => setShowEduModal(false)}
                    />
                )}
            </DashBoardLayout>
        </UserLayout>
    )
}

export default ProfilePage;