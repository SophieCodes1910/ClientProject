import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; 
import { db } from "../../firebase"; 
import { doc, getDoc } from "firebase/firestore"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './eventDetails.css';

const EventDetails = () => {
    const location = useLocation();
    const { docId } = location.state || {};
    const [inviteeEmails, setInviteeEmails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!docId) {
            toast.error("Event details are missing. Please go back and try again.");
            return;
        }

        const fetchEventDetails = async () => {
            try {
                const eventRef = doc(db, "events", docId);
                const docSnap = await getDoc(eventRef);

                // Check if the document exists
                if (!docSnap.exists()) {
                    toast.error("No such event found!");
                    return;
                }

                const eventData = docSnap.data();
                console.log("Event Data:", eventData); // Log the fetched data for debugging

                // Validate and set invitee emails
                if (eventData.inviteeEmails && Array.isArray(eventData.inviteeEmails)) {
                    setInviteeEmails(eventData.inviteeEmails);
                } else {
                    console.error("Expected inviteeEmails to be an array, but got:", eventData.inviteeEmails);
                    setInviteeEmails([]); // Default to an empty array if the data is not as expected
                }
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
        return <div>Loading...</div>; 
    }

    return (
        <div className="event-details-container">
            <h2>Event Details</h2>
            <h3>Invitees</h3>
            <ul>
                {inviteeEmails.length === 0 ? (
                    <li>No invitees added yet.</li>
                ) : (
                    inviteeEmails.map((email, index) => <li key={index}>{email}</li>)
                )}
            </ul>
            <ToastContainer />
        </div>
    );
};

export default EventDetails;
