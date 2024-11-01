import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './eventDetails.css';

const EventDetails = () => {
    const location = useLocation();
    const { docId } = location.state || {}; // Get docId from state

    const [eventDetails, setEventDetails] = useState(null); // Hold the event details
    const [loading, setLoading] = useState(true);
    const [additionalDetailsOpen, setAdditionalDetailsOpen] = useState(false);

    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!docId) {
                toast.error("Event details are missing. Please go back and try again.");
                setLoading(false);
                return;
            }

            try {
                const eventRef = doc(db, "events", docId);
                const docSnap = await getDoc(eventRef);
                
                if (!docSnap.exists()) {
                    toast.error("No such event found!");
                    return;
                }

                const eventData = docSnap.data();
                setEventDetails(eventData);
            } catch (error) {
                console.error("Error fetching event details:", error);
                toast.error("Error fetching event details.");
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [docId]);

    if (loading) {
        return <div className="loading-indicator">Loading event details...</div>;
    }

    if (!eventDetails) {
        return <div>No event details found.</div>;
    }

    return (
        <div className="event-details-container">
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

                <div><strong>Advertisement Plans:</strong> {eventDetails.adPlans || "N/A"}</div>
                <div><strong>Visibility:</strong> {eventDetails.isPublic ? "Public" : "Private"}</div>

                <h3>Added Plans</h3>
                <ul>
                    {eventDetails.addedPlans && eventDetails.addedPlans.length > 0 ? (
                        eventDetails.addedPlans.map((plan, index) => (
                            <li key={index}>{plan}</li>
                        ))
                    ) : (
                        <li>No plans added yet.</li>
                    )}
                </ul>

                <h3>Uploaded Files</h3>
                <ul>
                    {eventDetails.uploadedFiles && eventDetails.uploadedFiles.length > 0 ? (
                        eventDetails.uploadedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))
                    ) : (
                        <li>No files uploaded yet.</li>
                    )}
                </ul>
            </div>

            <button
                type="button"
                className="toggle-details"
                onClick={() => setAdditionalDetailsOpen(!additionalDetailsOpen)}
            >
                {additionalDetailsOpen ? "Hide Additional Details" : "Show Additional Details"}
            </button>

            {additionalDetailsOpen && (
                <div className="additional-details">
                    <h3>Additional Plans</h3>
                    <ul>
                        {eventDetails.addedPlans.map((plan, index) => (
                            <li key={index}>{plan}</li>
                        ))}
                    </ul>
                    <h3>Uploaded Files</h3>
                    <ul>
                        {eventDetails.uploadedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default EventDetails;
