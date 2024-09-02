import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BalanceDisplay = () => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        const fetchBalance = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await axios.get('http://localhost:8080/api/user/balance', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBalance(response.data.balance);
            } catch (err) {
                console.error(err.response ? err.response.data.message : err.message);
            }
        };

        fetchBalance();
    }, []);

    return (
        <div>
            <h2>Your Balance</h2>
            <p>${balance}</p>
        </div>
    );
};

export default BalanceDisplay;
