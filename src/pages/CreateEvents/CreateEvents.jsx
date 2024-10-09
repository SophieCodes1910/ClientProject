// CreateEvents.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './createEvents.css';

const apiUrl = import.meta.env.VITE_API_URL;

export const CreateEvents = () => {
    const [eventName, setEventName] = useState("");
    const organizerEmail = localStorage.getItem("email"); // Organizer email from localStorage
    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventData = {
            eventName,
            organizerEmail,
        };

        try {
            const response = await axios.post(apiUrl + "/invitations/invitationByName", eventData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                toast.success("Event created successfully!", {
                    position: "bottom-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    onClose: () => navigate("/EventDetails", { state: { eventName, organizerEmail } }) 
                });
                setEventName('');
            } else {
                toast.error("Failed to create event: " + response.data.message);
            }
        } catch (error) {
            console.error("Error creating event:", error);
            if (!error.response) {
                navigate("/EventDetails", { state: { eventName, organizerEmail } }) //remove once server working
                toast.error("Server not working. Please try again later.");
            } else {
                toast.error("An error occurred while creating the event. Please try again.");
            }
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

