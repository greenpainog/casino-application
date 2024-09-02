import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Token:', token); // Log token for debugging
                if (!token) throw new Error('No token found');
    
                const userResponse = await axios.get('http://localhost:8080/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('User Response:', userResponse.data); // Log user response
    
                const balanceResponse = await axios.get('http://localhost:8080/api/user/balance', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Balance Response:', balanceResponse.data); // Log balance response
    
                setUsername(userResponse.data.username);
                setBalance(balanceResponse.data.balance);
            } catch (err) {
                console.error('Error fetching data:', err); // Log error
                setError(err.response ? err.response.data.message : err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Username: {username}</p>
            <p>Balance: ${balance !== null ? balance : 'N/A'}</p>
        </div>
    );
};

export default Dashboard;
