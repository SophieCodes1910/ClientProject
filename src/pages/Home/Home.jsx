import { useState, useEffect } from 'react';
import './home.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Loader } from "../../components/Loader/Loader.jsx";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    // Function to fetch events
    const fetchEvents = async () => {
        const organizerEmail = localStorage.getItem("email");
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/invitations/organizer/${organizerEmail}/events`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                const publicEvents = response.data.data.filter(event => event.isPublic);
                setEvents(publicEvents);
            } else {
                toast.error("Failed to fetch events: " + response.data.message, {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            let errorMessage = "An error occurred while fetching events. Please try again.";
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message; // Use server-provided message if available
            }
            toast.error(errorMessage, {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false); // Ensure loading state is reset
        }
    };

    // Use effect to fetch events when component mounts
    useEffect(() => {
        fetchEvents();
    }, []); // Removed dependency on loggedIn

    return (
        <div className={events.length > 0 ? 'home-container' : "no-events-container"}>
            {
                loading ? <Loader /> : <div>
                    <div className="home-content">
                        <div className="events-grid">
                            {events.length > 0 ? (
                                events.reverse().map(event => {
                                    return (
                                        <div key={event.id}>
                                            <div className="event-card">
                                                <Link to={`/events/event/${event.id}`}>
                                                    <h3>{event.eventName}</h3>
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="no-events">
                                    <h3>No events found.</h3>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }
            <ToastContainer />
        </div>
    );
};
