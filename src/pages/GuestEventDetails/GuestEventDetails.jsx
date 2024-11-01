import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './guestEventDetails.css';

const GuestEventDetails = () => {
    const { eventId } = useParams();
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const eventRef = doc(db, "events", eventId);
                const docSnap = await getDoc(eventRef);

                if (!docSnap.exists()) {
                    toast.error("No such event found!");
                    return;
                }

                setEventDetails(docSnap.data());
            } catch (error) {
                console.error("Error fetching event details:", error);
                toast.error("Error fetching event details.");
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [eventId]);

    if (loading) {
        return <div className="loading-indicator">Loading event details...</div>;
    }

    if (!eventDetails) {
        return <div>No event details found.</div>;
    }

    return (
        <div className="guest-event-details-container">
            <h2>Event Details</h2>
            <div className="event-info">
                <div><strong>Event Name:</strong> {eventDetails.eventName || "N/A"}</div>
                <div><strong>Organizer Email:</strong> {eventDetails.organizerEmail || "N/A"}</div>
                <div><strong>Description:</strong> {eventDetails.description || "N/A"}</div>
                <div><strong>Location:</strong> {eventDetails.location || "N/A"}</div>
                <div><strong>Date:</strong> {eventDetails.eventDate || "N/A"}</div>
                <div><strong>Start Time:</strong> {eventDetails.eventStartTime || "N/A"}</div>
                <div><strong>End Time:</strong> {eventDetails.eventEndTime || "N/A"}</div>

                <h3>Invitees</h3>
                <ul>
                    {eventDetails.inviteeEmails && eventDetails.inviteeEmails.length > 0 ? (
                        eventDetails.inviteeEmails.map((email, index) => (
                            <li key={index}>{email}</li>
                        ))
                    ) : (
                        <li>No invitees added yet.</li>
                    )}
                </ul>

                <h3>Uploaded Files</h3>
                <ul>
                    {eventDetails.uploadedFiles && eventDetails.uploadedFiles.length > 0 ? (
                        eventDetails.uploadedFiles.map((file, index) => (
                            <li key={index}>
                                <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                            </li>
                        ))
                    ) : (
                        <li>No files uploaded yet.</li>
                    )}
                </ul>
            </div>
            <ToastContainer />
        </div>
    );
};

export default GuestEventDetails;
