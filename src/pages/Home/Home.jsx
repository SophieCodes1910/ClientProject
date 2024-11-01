import { useState, useEffect } from 'react';
import './home.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from "../../firebase"; // Import your Firestore database instance
import { collection, getDocs, query, where } from "firebase/firestore"; // Import Firestore methods
import { Loader } from "../../components/Loader/Loader.jsx"; // Ensure this is the correct path
import { Link } from "react-router-dom";

export const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    // Function to fetch events
    const fetchEvents = async () => {
        const organizerEmail = localStorage.getItem("email");

        // Check if required values are available
        if (!organizerEmail) {
            toast.error("Missing email. Please log in again.");
            return; // Prevent API call if credentials are missing
        }

        setLoading(true);

        try {
            // Define your Firestore collection reference
            const eventsRef = collection(db, "events");
            const q = query(eventsRef, where("organizerEmail", "==", organizerEmail));

            // Fetch documents from Firestore
            const querySnapshot = await getDocs(q);
            const publicEvents = [];

            querySnapshot.forEach((doc) => {
                const eventData = { id: doc.id, ...doc.data() };
                if (eventData.isPublic) { // Only include public events
                    publicEvents.push(eventData);
                }
            });

            // Set the fetched public events to state
            setEvents(publicEvents);
        } catch (error) {
            // Log detailed error info
            console.error("Error fetching events:", error);
            let errorMessage = "An error occurred while fetching events. Please try again.";
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
    }, []); // No dependency to cause re-fetch

    return (
        <div className={events.length > 0 ? 'home-container' : "no-events-container"}>
            {
                loading ? <Loader /> : <div>
                    <div className="home-content">
                        <div className="events-grid">
                            {events.length > 0 ? (
                                events.reverse().map(event => (
                                    <div key={event.id}>
                                        <div className="event-card">
                                            <Link to={`/events/event/${event.id}`}>
                                                <h3>{event.eventName}</h3>
                                            </Link>
                                        </div>
                                    </div>
                                ))
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

