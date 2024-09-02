import React from 'react';
import SlotMachine from '../components/SlotMachine'; // Ensure SlotMachine is correctly imported
import './SlotPage.css'; // Import CSS for styling

const SlotPage = () => {
    return (
        <div className="slot-page">
            <h2>Play Slot Machine</h2>
            <SlotMachine />
        </div>
    );
};

export default SlotPage;
