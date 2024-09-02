import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import BalanceDisplay from './components/BalanceDisplay';
import UserProfile from './components/userprofile'; // Ensure correct case for import
import Dashboard from './components/Dashboard';
import SlotPage from './pages/SlotPage'; // Import SlotPage

function App() {
    const [token, setToken] = React.useState(localStorage.getItem('token'));
    const [username, setUsername] = React.useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUsername('');
    };

    return (
        <Router>
            <div className="App">
                {token && (
                    <>
                        <button onClick={handleLogout}>Logout</button>
                        <nav>
                            <Link to="/">Home</Link> | {' '}
                            <Link to="/play-slot">Play Slot</Link> | {' '}
                            <Link to="/user-profile">Profile</Link>
                        </nav>
                    </>
                )}
                <Routes>
                    <Route
                        path="/"
                        element={
                            !token ? (
                                <>
                                    <RegisterForm setUsername={setUsername} />
                                    <LoginForm setToken={setToken} />
                                </>
                            ) : (
                                <>
                                    <h1>Welcome, {username}!</h1>
                                    <Dashboard />
                                    <BalanceDisplay />
                                </>
                            )
                        }
                    />
                    <Route path="/play-slot" element={<SlotPage />} /> {/* Route for SlotPage */}
                    <Route path="/user-profile" element={<UserProfile />} /> {/* Route for UserProfile */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
