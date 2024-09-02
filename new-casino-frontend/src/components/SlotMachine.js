import React, { useState } from 'react';
import axios from 'axios';
import cherry from '../assets/images/cherry.png';
import lemon from '../assets/images/lemon.png';
import orange from '../assets/images/orange.png';
import watermelon from '../assets/images/watermelon.png';
import grape from '../assets/images/grape.png';
import strawberry from '../assets/images/strawberry.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './SlotMachine.css';

// Map symbols to images
const symbolImages = {
    '🍒': cherry,
    '🍋': lemon,
    '🍊': orange,
    '🍉': watermelon,
    '🍇': grape,
    '🍓': strawberry
};

const symbols = Object.keys(symbolImages);

const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

const SlotMachine = () => {
    const [reels, setReels] = useState(['🍒', '🍒', '🍒']);
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState('');
    const [balance, setBalance] = useState(100); // Initialize with some balance
    const [error, setError] = useState('');

    const navigate = useNavigate(); // Initialize useNavigate hook

    const spinReels = async () => {
        if (isSpinning) return; // Prevent spinning if already spinning

        setIsSpinning(true);

        // Apply spinning animation
        const reelElements = document.querySelectorAll('.slot-symbol');
        reelElements.forEach(el => el.classList.add('spin-animation'));

        // Simulate spinning
        const newReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        setTimeout(async () => { // Mark the function inside setTimeout as async
            setReels(newReels);
            reelElements.forEach(el => el.classList.remove('spin-animation')); // Remove spinning animation
            setIsSpinning(false);

            // Check for result
            const win = newReels.every(symbol => symbol === newReels[0]);
            const winnings = win ? 10 : 0; // Example: Win 10 if all symbols match

            // Deduct cost (example: 5) and calculate new balance
            const cost = 5;
            const newBalance = balance - cost + winnings;

            // Update the result and balance
            setResult(win ? 'You Win!' : 'Try Again!');
            setBalance(newBalance);

            // Call backend to update balance
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await axios.put('http://localhost:8080/api/user/balance', { balance: newBalance }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } catch (error) {
                    console.error('Error updating balance:', error);
                    setError('Failed to update balance.');
                }
            }
        }, 1000); // Adjust duration to match animation
    };

    return (
        <div className="slot-machine">
            <h2>Slot Machine</h2>
            <div className="slot-container">
                {reels.map((symbol, index) => (
                    <div key={index} className="slot-symbol">
                        <img src={symbolImages[symbol]} alt={symbol} />
                    </div>
                ))}
            </div>
            <button onClick={spinReels} disabled={isSpinning}>
                {isSpinning ? 'Spinning...' : 'Spin'}
            </button>
            <p>{result}</p>
            <p>Balance: ${balance}</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={() => navigate('/user-profile')}>Return to Profile</button> {/* Navigation button */}
        </div>
    );
};

export default SlotMachine;
