import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './GuestEventDetails.css';

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

                {/* Invitees Section Hidden */}
            </div>
            <ToastContainer />
        </div>
    );
};

export default GuestEventDetails;
