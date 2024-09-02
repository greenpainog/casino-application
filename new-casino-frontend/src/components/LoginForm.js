import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ setToken, setUsername }) => {
    const [username, setUsernameState] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/player/login', {
                username,
                password
            });

            // Store the JWT token in local storage
            localStorage.setItem('token', response.data.token);
            
            // Update the parent component's state
            setToken(response.data.token);
            setUsername(username);

            // Clear form fields and error message
            setUsernameState('');
            setPassword('');
            setError('');
            setSuccess('Login successful!');

        } catch (err) {
            // Handle error
            setError('Login failed. Please check your credentials.');
            setSuccess('');
            console.error(err.response ? err.response.data.message : err.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsernameState(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default LoginForm;
