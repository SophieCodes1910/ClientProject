//CreateEvent.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../index"; // Ensure firebase is correctly initialized
import { addDoc, collection } from "firebase/firestore";
import './createEvents.css';

export const CreateEvents = () => {  
    const [eventName, setEventName] = useState("");
    const organizerEmail = localStorage.getItem("email");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Debug: Check if organizerEmail is set
        console.log("Organizer Email:", organizerEmail);

        const eventData = {
            eventName,
            organizerEmail,
        };

        try {
            // Add event to Firestore collection 'events'
            const docRef = await addDoc(collection(db, "events"), eventData);
            toast.success("Event created successfully!", {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                onClose: () => navigate("/EventDetails", { state: { eventName, organizerEmail, docId: docRef.id } }) 
            });
            // Clear input field after submission
            setEventName('');
        } catch (error) {
            console.error("Error creating event:", error);
            toast.error(`Error: ${error.message}`); // Show specific error message
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
