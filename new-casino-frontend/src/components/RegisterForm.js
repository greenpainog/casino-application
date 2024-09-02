import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = ({ setUsername }) => {
    const [username, setLocalUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/player/register', {
                username,
                password
            });

            // Handle success
            setUsername(username);
            setLocalUsername('');
            setPassword('');
            setError('');
            console.log(response.data.message); // Display success message
        } catch (err) {
            // Handle error
            setError('Registration failed. Please try again.');
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setLocalUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default RegisterForm;
