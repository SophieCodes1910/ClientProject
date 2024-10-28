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

                // Fetch events the user organized
                const organizedQuery = query(eventsCollection, where("organizerEmail", "==", email));
                const organizedSnapshot = await getDocs(organizedQuery);

                // Fetch events the user is invited to
                const invitedQuery = query(eventsCollection, where("invitedEmails", "array-contains", email));
                const invitedSnapshot = await getDocs(invitedQuery);

                const fetchedEvents = [
                    ...organizedSnapshot.docs.map(doc => {
                        const data = doc.data();
                        return parseEventData(doc, data, true);
                    }),
                    ...invitedSnapshot.docs.map(doc => {
                        const data = doc.data();
                        return parseEventData(doc, data, false);
                    })
                ];

                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        // Helper function to parse event data
        const parseEventData = (doc, data, isOrganizer) => {
            const startTime = `${data.eventDate}T${data.eventStartTime}:00`;
            const endTime = `${data.eventDate}T${data.eventEndTime}:00`;
            const eventStartTime = new Date(startTime);
            const eventEndTime = new Date(endTime);

            return {
                id: doc.id,
                ...data,
                eventStartTime: !isNaN(eventStartTime.getTime()) ? eventStartTime : null,
                eventEndTime: !isNaN(eventEndTime.getTime()) ? eventEndTime : null,
                isOrganizer
            };
        };

        fetchEvents();
    }, [email]);

    const handleEditClick = (event) => {
        if (event.isOrganizer) {
            navigate("/EventDetails", { state: { docId: event.id } });
        }
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
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
                                    <p className="event-type">
                                        {event.isOrganizer ? "My Event" : "Invited Event"}
                                    </p>
                                </div>
                                <p><strong>Location:</strong> {event.location}</p>
                                <p><strong>Start:</strong> {event.eventStartTime ? event.eventStartTime.toLocaleString() : "N/A"}</p>
                                <p><strong>End:</strong> {event.eventEndTime ? event.eventEndTime.toLocaleString() : "N/A"}</p>
                                {event.isOrganizer && (
                                    <button className="edit-button" onClick={() => handleEditClick(event)}>
                                        Edit
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </>
    );
};
