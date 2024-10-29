import React, { useState } from "react"; // Ensure useState is imported only once
import { addDoc, collection } from "firebase/firestore"; // Firestore imports
import { useNavigate } from "react-router-dom"; // Navigation import
import { ToastContainer, toast } from "react-toastify"; // Toast imports
import './createEvents.css'; // CSS import
import { db } from "../../firebase"; // Import your Firestore db

export const CreateEvents = () => {
    const [eventName, setEventName] = useState(""); // State for event name
    const organizerEmail = localStorage.getItem("email"); // Get organizer email from local storage
    const navigate = useNavigate(); // Use navigate for routing

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        const eventData = {
            eventName,
            organizerEmail,
        };

        try {
            const docRef = await addDoc(collection(db, "events"), eventData); // Add event to Firestore
            toast.success("Event created successfully!", {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                onClose: () => navigate("/EventDetails", { state: { docId: docRef.id } }) // Redirect to EventDetails
            });
            setEventName(''); // Reset event name input
        } catch (error) {
            console.error("Error creating event:", error);
            toast.error(`Error: ${error.message}`); // Show error toast
        }
    };

    return (
        <div className="create-events-container">
            <div className="events">
                <h2>Create an Event</h2>
                <form className="event-form" onSubmit={handleSubmit}>
                    <div className="event-form_top">
                        <div>
                            <label htmlFor="event-name">Event Name:</label>
                            <input
                                id="event-name"
                                type="text"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button className="create-event" type="submit">Create Event</button>
                </form>
                <ToastContainer />
            </div>
        </div>
    );
};
