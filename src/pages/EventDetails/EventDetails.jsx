//EventDetails.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; 
import { db } from "../../firebase"; 
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './eventDetails.css';

const EventDetails = () => {
    const location = useLocation();
    const { docId } = location.state || {}; // Retrieve docId from the location state
    
    const [eventName, setEventName] = useState("");
    const [locationName, setLocationName] = useState("");
    const [eventStartTime, setEventStartTime] = useState("");
    const [eventEndTime, setEventEndTime] = useState("");
    const [inviteeEmails, setInviteeEmails] = useState([]);
    const [newEmail, setNewEmail] = useState(""); // State for new email input
    const [additionalDetailsOpen, setAdditionalDetailsOpen] = useState(false);
    const [adPlans, setAdPlans] = useState(""); // For additional plans
    const [additionalNotes, setAdditionalNotes] = useState(""); // For additional notes
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Check if docId is present
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
                setEventName(eventData.eventName || "");
                setLocationName(eventData.location || "");
                setEventStartTime(eventData.eventStartTime || "");
                setEventEndTime(eventData.eventEndTime || "");
                setInviteeEmails(eventData.inviteeEmails || []);
                setAdPlans(eventData.adPlans || ""); // Load additional plans
                setAdditionalNotes(eventData.additionalNotes || ""); // Load additional notes
            } catch (error) {
                console.error("Error fetching event details:", error);
                toast.error("Error fetching event details.");
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [docId]);

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        try {
            const eventRef = doc(db, "events", docId);
            await updateDoc(eventRef, {
                eventName,
                location: locationName,
                eventStartTime,
                eventEndTime,
                inviteeEmails,
                adPlans, // Update additional plans
                additionalNotes // Update additional notes
            });
            toast.success("Event updated successfully!");
        } catch (error) {
            console.error("Error updating event:", error);
            toast.error("Error updating event.");
        }
    };

    const handleAddEmail = () => {
        if (newEmail && !inviteeEmails.includes(newEmail)) {
            setInviteeEmails([...inviteeEmails, newEmail]);
            setNewEmail(""); // Clear input after adding
        } else {
            toast.error("Please enter a valid email or avoid duplicates.");
        }
    };

    const handleRemoveEmail = (emailToRemove) => {
        setInviteeEmails(inviteeEmails.filter(email => email !== emailToRemove));
    };

    // Display loading state while fetching event details
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="event-details-container">
            <h2>Event Details</h2>
            <form onSubmit={handleUpdateEvent}>
                <label>Event Name:</label>
                <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                />

                <label>Location:</label>
                <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                />

                <label>Start Time:</label>
                <input
                    type="datetime-local"
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                />

                <label>End Time:</label>
                <input
                    type="datetime-local"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                />

                <h3>Invitees</h3>
                <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Add invitee email"
                />
                <button type="button" onClick={handleAddEmail}>Add Email</button>
                <ul>
                    {inviteeEmails.length === 0 ? (
                        <li>No invitees added yet.</li>
                    ) : (
                        inviteeEmails.map((email, index) => (
                            <li key={index}>
                                {email}
                                <button type="button" onClick={() => handleRemoveEmail(email)}>Remove</button>
                            </li>
                        ))
                    )}
                </ul>

                <button type="button" onClick={() => setAdditionalDetailsOpen(!additionalDetailsOpen)}>
                    {additionalDetailsOpen ? "Close Additional Details" : "Additional Details"}
                </button>

                {additionalDetailsOpen && (
                    <div className="additional-details">
                        <label>Plans:</label>
                        <textarea
                            value={adPlans}
                            onChange={(e) => setAdPlans(e.target.value)}
                            placeholder="Add your plans here..."
                        />

                        <label>Additional Notes:</label>
                        <textarea
                            value={additionalNotes}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                            placeholder="Add any additional notes here..."
                        />

                        <label>Import Map PDF:</label>
                        <input type="file" accept="application/pdf" />

                        <label>Add Plans (Image or PDF):</label>
                        <input type="file" accept="image/*,application/pdf" />
                    </div>
                )}

                <button type="submit">Update Event</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EventDetails;


