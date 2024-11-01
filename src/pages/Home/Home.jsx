import { useState, useEffect } from 'react';
import './home.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Loader } from "../../components/Loader/Loader.jsx";
import { Link } from "react-router-dom";

export const Home = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);

        try {
            const eventsRef = collection(db, "events");
            const q = query(eventsRef, where("isPublic", "==", true));

            const querySnapshot = await getDocs(q);
            const publicEvents = [];

            querySnapshot.forEach((doc) => {
                const eventData = { id: doc.id, ...doc.data() };
                publicEvents.push(eventData);
            });

            setEvents(publicEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
            toast.error("An error occurred while fetching events. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className={events.length > 0 ? 'home-container' : "no-events-container"}>
            {loading ? <Loader /> : (
                <div className="home-content">
                    <div className="events-grid">
                        {events.length > 0 ? (
                            events.reverse().map(event => (
                                <div key={event.id} className="event-card">
                                    <Link to={`/events/event//${event.id}`}>
                                        <h3>{event.eventName}</h3>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="no-events">
                                <h3>No events found.</h3>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};
