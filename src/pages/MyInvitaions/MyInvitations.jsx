import React, {useState, useEffect} from "react";
import axios from "axios";
import "./myInvitations.css";
import {Loader} from "../../components/Loader/Loader.jsx";

export const MyInvitations = () => {
    const [events, setEvents] = useState([]);
    const [expandedSubEvent, setExpandedSubEvent] = useState(null);
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchEvents = async () => {
            try {
                const response = await axios.get(apiUrl + `/guests/account/${email}/events`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    // Sort events by start time (ascending)
                    const sortedEvents = response.data.data.sort((a, b) => new Date(a.eventStartTime) - new Date(b.eventStartTime));
                    setEvents(sortedEvents);
                    console.log(sortedEvents)

                    setLoading(false);
                } else {
                    console.error("Failed to fetch events:", response.data.message);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, [email]);

    const toggleAccordion = (id) => {
        setExpandedSubEvent(expandedSubEvent === id ? null : id);
    };

    const handleResponse = async (url) => {
        try {
            await axios.get(url);
            window.location.reload();  // Refresh the page after the request is made
        } catch (error) {
            console.error("Error sending response:", error);
        }
    };

    return (<>
        {loading ? (<Loader/>) : (
            <div className={events.length > 0 ? 'my-invitations-container' : "no-events-container"}>
                {events.length === 0 ? (<div className="no-events-card">
                    <h3>No Events Found</h3>
                    <p>
                        There are no events to display. Please check back later or
                        create a new event.
                    </p>
                </div>) : (events.map((event) => (<div key={event.id} className="event-card">
                    <div className="event-header">
                        <h2 className="event-name">{event.eventName}</h2>
                        <span className={`event-status ${event.response}`}>
                    {event.response}
                  </span>
                    </div>
                    <p>
                        <strong>Location:</strong> {event.location}
                    </p>
                    <p>
                        <strong>Start:</strong> {new Date(event.eventStartTime).toLocaleString()}
                    </p>
                    <p>
                        <strong>End:</strong> {new Date(event.eventEndTime).toLocaleString()}
                    </p>
                    <p>
                        <strong>Note:</strong> {event.note}
                    </p>
                    <a href={"mailto:" + event.organizerEmail}>
                        <strong>Organizer:</strong> {event.organizerName} ({event.organizerEmail})
                    </a>
                    {event.response == "PENDING" ? <div className="response-buttons">
                        <button
                            className="response-button accept"
                            onClick={() => handleResponse(event.responseLink + `&response=yes`)}
                        >
                            Accept
                        </button>
                        <button
                            className="response-button decline"
                            onClick={() => handleResponse(event.responseLink + `&response=no`)}
                        >
                            Decline
                        </button>
                    </div> : ""}
                    {event.subEvents.length > 0 && (
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
                                            <p>
                                                <strong>Start:</strong> {new Date(sub.startTime).toLocaleString()}
                                            </p>
                                            <p>
                                                <strong>End:</strong> {new Date(sub.endTime).toLocaleString()}
                                            </p>
                                            <p><strong>Location:</strong> {sub.location}</p>
                                            <p><strong>Note:</strong> {sub.note}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                </div>)))}
            </div>)}
    </>);
};
