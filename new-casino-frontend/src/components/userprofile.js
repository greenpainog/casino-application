import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

const UserProfile = () => {
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsername(response.data.username);
            } catch (err) {
                setError('Failed to fetch profile.');
                console.error(err.response ? err.response.data.message : err.message);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdate = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('http://localhost:8080/api/user/profile', {
                newPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(response.data.message);
            setNewPassword('');
            setError('');
        } catch (err) {
            setError('Failed to update profile.');
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    return (
        <div>
            <h2>User Profile</h2>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} disabled />
                </div>
                <div>
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
            <Link to="/play-slot">
                <button>Play Slot</button>
            </Link>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default UserProfile;
