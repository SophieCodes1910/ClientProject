import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; // Import your Firebase configuration
import { collection, query, where, getDocs } from "firebase/firestore"; // Firestore functions
import { Loader } from "../../components/Loader/Loader.jsx";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./myInvitations.css";

export const MyInvitations = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const email = localStorage.getItem("email");
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const eventsCollection = collection(db, "events");
                const q = query(eventsCollection, where("organizerEmail", "==", email));

                const querySnapshot = await getDocs(q);
                const fetchedEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Sort events by start time (ascending)
                const sortedEvents = fetchedEvents.sort((a, b) => 
                    new Date(a.eventStartTime) - new Date(b.eventStartTime)
                );
                setEvents(sortedEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [email]);

    const handleEditClick = (event) => {
        navigate("/EventDetails", { state: event }); // Correctly navigate to EventDetails with the event data
    };
    

    return (
        <>
            {loading ? (<Loader />) : (
                <div className={events.length > 0 ? 'my-invitations-container' : "no-events-container"}>
                    {events.length === 0 ? (
                        <div className="no-events-card">
                            <h3>No Events Found</h3>
                            <p>
                                There are no events to display. Please check back later or
                                create a new event.
                            </p>
                        </div>
                    ) : (
                        events.map((event) => (
                            <div key={event.id} className="event-card">
                                <div className="event-header">
                                    <h2 className="event-name">{event.eventName}</h2>
                                    <span className={`event-status ${event.response}`}>
                                        {event.response}
                                    </span>
                                </div>
                                <p><strong>Location:</strong> {event.location}</p>
                                <p><strong>Start:</strong> {new Date(event.eventStartTime).toLocaleString()}</p>
                                <p><strong>End:</strong> {new Date(event.eventEndTime).toLocaleString()}</p>
                                <p><strong>Note:</strong> {event.note}</p>
                                <a href={"mailto:" + event.organizerEmail}>
                                    <strong>Organizer:</strong> {event.organizerName} ({event.organizerEmail})
                                </a>
                                <button className="edit-button" onClick={() => handleEditClick(event)}>
                                    Edit
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </>
    );
};
