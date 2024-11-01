import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { Loader } from "../../components/Loader/Loader.jsx";
import { useNavigate } from "react-router-dom";
import "./myInvitations.css";

export const MyInvitations = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all"); // New state for filter
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

                // Sort events with "My Events" first, then "Invited Events"
                fetchedEvents.sort((a, b) => b.isOrganizer - a.isOrganizer);
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
                isOrganizer,
                status: data.inviteStatus?.[email] || "pending" // Status of invite (accept/decline)
            };
        };

        fetchEvents();
    }, [email]);

    const handleEditClick = (event) => {
        if (event.isOrganizer) {
            navigate("/EventDetails", { state: { docId: event.id } });
        }
    };

    // Accept/Decline invitation
    const handleInvitationResponse = async (eventId, response) => {
        try {
            const eventDocRef = doc(db, "events", eventId);
            await updateDoc(eventDocRef, {
                [`inviteStatus.${email}`]: response // Update invite status for this email
            });
            setEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === eventId ? { ...event, status: response } : event
                )
            );
        } catch (error) {
            console.error("Error updating invitation status:", error);
        }
    };

    // Filtered events based on filter state
    const filteredEvents = events.filter(event => {
        if (filter === "all") return true;
        if (filter === "organized") return event.isOrganizer;
        if (filter === "invited") return !event.isOrganizer;
        return true;
    });

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
                        <>
                            <div className="filter-buttons">
                                <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All Events</button>
                                <button onClick={() => setFilter("organized")} className={filter === "organized" ? "active" : ""}>My Events</button>
                                <button onClick={() => setFilter("invited")} className={filter === "invited" ? "active" : ""}>Invited Events</button>
                            </div>
                            {filteredEvents.map((event) => (
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
                                    {event.isOrganizer ? (
                                        <button className="edit-button" onClick={() => handleEditClick(event)}>
                                            Edit
                                        </button>
                                    ) : (
                                        <div className="invitation-actions">
                                            {event.status === "accepted" ? (
                                                <p className="accepted-text">Accepted</p>
                                            ) : event.status === "declined" ? (
                                                <p className="declined-text">Declined</p>
                                            ) : (
                                                <>
                                                    <button onClick={() => handleInvitationResponse(event.id, "accepted")} className="accept-button">Accept</button>
                                                    <button onClick={() => handleInvitationResponse(event.id, "declined")} className="decline-button">Decline</button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}
        </>
    );
};

