import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Loader } from "../../components/Loader/Loader.jsx";
import { useNavigate } from "react-router-dom";
import "./myInvitations.css";

export const MyInvitations = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const email = localStorage.getItem("email");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const eventsCollection = collection(db, "events");
                const q = query(eventsCollection, where("organizerEmail", "==", email));
                const querySnapshot = await getDocs(q);
                const fetchedEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [email]);

    const handleEditClick = (event) => {
        navigate("/EventDetails", { state: { docId: event.id } });
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
                                </div>
                                <p><strong>Location:</strong> {event.location}</p>
                                <p><strong>Start:</strong> {new Date(event.eventStartTime).toLocaleString()}</p>
                                <p><strong>End:</strong> {new Date(event.eventEndTime).toLocaleString()}</p>
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
