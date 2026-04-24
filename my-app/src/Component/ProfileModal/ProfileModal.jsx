import React, { useState } from 'react';
import styles from './ProfileModal.module.css';

const ProfileModal = ({ title, fields, onSave, onClose }) => {
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2>{title}</h2>
                    <button onClick={onClose} className={styles.closeBtn}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className={styles.modalBody}>
                    {fields.map((field) => (
                        <div key={field.name} className={styles.fieldGroup}>
                            <label htmlFor={field.name}>{field.label}</label>
                            <input
                                type={field.type || "text"}
                                id={field.name}
                                name={field.name}
                                placeholder={field.placeholder}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                        <button type="submit" className={styles.saveBtn}>Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
