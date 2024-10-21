import React, { useState, useEffect } from "react";
import { db } from "../../firebase"; // Import your Firebase configuration
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"; // Firestore functions
import { Loader } from "../../components/Loader/Loader.jsx";
import "./myInvitations.css";

export const MyInvitations = () => {
    const [events, setEvents] = useState([]);
    const [expandedSubEvent, setExpandedSubEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editEvent, setEditEvent] = useState(null);
    const email = localStorage.getItem("email");

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const eventsCollection = collection(db, "events");
                // Query to get events where the organizerEmail matches the current user's email
                const q = query(eventsCollection, where("organizerEmail", "==", email)); 

                const querySnapshot = await getDocs(q);
                const fetchedEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Sort events by start time (ascending) if eventStartTime is defined
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

    const toggleAccordion = (id) => {
        setExpandedSubEvent(expandedSubEvent === id ? null : id);
    };

    const handleEditClick = (event) => {
        setEditEvent(event); // Store the event to edit
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditEvent((prev) => ({ ...prev, [name]: value })); // Update the specific field
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        if (!editEvent) return;

        try {
            const eventDoc = doc(db, "events", editEvent.id);
            await updateDoc(eventDoc, { ...editEvent }); // Update the event in Firestore
            setEditEvent(null); // Clear edit event
            // Optionally, refresh the event list here or use local state update
            alert("Event updated successfully!");
        } catch (error) {
            console.error("Error updating event:", error);
        }
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
                            <div key={event.id} className="event-card" onClick={() => handleEditClick(event)}>
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
                                {/* Assuming you are managing responses differently for created events */}
                                <div className="response-buttons">
                                    {/* Add any response buttons or actions if needed */}
                                </div>
                                {event.subEvents && event.subEvents.length > 0 && (
                                    <div className="sub-events">
                                        <h4>Sub Events:</h4>
                                        {event.subEvents.map((sub) => (
                                            <div key={sub.id} className="sub-event">
                                                <div
                                                    className="accordion-header"
                                                    onClick={() => toggleAccordion(`${event.id}-${sub.id}`)}
                                                >
                                                    <p><strong>Part Name:</strong> {sub.partName}</p>
                                                    <span>
                                                        {expandedSubEvent === `${event.id}-${sub.id}` ? "-" : "+"}
                                                    </span>
                                                </div>
                                                {expandedSubEvent === `${event.id}-${sub.id}` && (
                                                    <div className="accordion-content">
                                                        <p><strong>Start:</strong> {new Date(sub.startTime).toLocaleString()}</p>
                                                        <p><strong>End:</strong> {new Date(sub.endTime).toLocaleString()}</p>
                                                        <p><strong>Location:</strong> {sub.location}</p>
                                                        <p><strong>Note:</strong> {sub.note}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    {/* Edit Event Form */}
                    {editEvent && (
                        <div className="edit-event-modal">
                            <h2>Edit Event</h2>
                            <form onSubmit={handleUpdateEvent}>
                                <div>
                                    <label>Event Name:</label>
                                    <input
                                        type="text"
                                        name="eventName"
                                        value={editEvent.eventName || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Location:</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={editEvent.location || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Start Time:</label>
                                    <input
                                        type="datetime-local"
                                        name="eventStartTime"
                                        value={editEvent.eventStartTime ? new Date(editEvent.eventStartTime).toISOString().slice(0, 16) : ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>End Time:</label>
                                    <input
                                        type="datetime-local"
                                        name="eventEndTime"
                                        value={editEvent.eventEndTime ? new Date(editEvent.eventEndTime).toISOString().slice(0, 16) : ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Note:</label>
                                    <textarea
                                        name="note"
                                        value={editEvent.note || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button type="submit">Update Event</button>
                                <button type="button" onClick={() => setEditEvent(null)}>Cancel</button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};
