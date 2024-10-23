import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; 
import { db } from "../../firebase"; // Ensure Firebase is correctly initialized
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './eventDetails.css';

const EventDetails = () => {
    const location = useLocation();
    const { eventName, organizerEmail, docId } = location.state || {};
    
    const [inviteeEmails, setInviteeEmails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const eventRef = doc(db, "events", docId);
                const docSnap = await getDoc(eventRef);

                if (docSnap.exists()) {
                    const eventData = docSnap.data();
                    // Set invitee emails or any other data you need
                    setInviteeEmails(eventData.inviteeEmails || []);
                } else {
                    console.error("No such document!");
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

    const handleAddInvitee = async (e) => {
        e.preventDefault();
        const newInviteeEmail = e.target.inviteeEmail.value;

        if (!newInviteeEmail) {
            toast.error("Invitee email is required.");
            return;
        }

        const updatedInvitees = [...inviteeEmails, newInviteeEmail];

        try {
            const eventRef = doc(db, "events", docId);
            await updateDoc(eventRef, { inviteeEmails: updatedInvitees });
            setInviteeEmails(updatedInvitees);
            toast.success("Invitee added successfully!");
            e.target.inviteeEmail.value = ""; // Clear input field
        } catch (error) {
            console.error("Error updating invitees:", error);
            toast.error("Error adding invitee.");
        }
    };

    if (loading) {
        return <div>Loading...</div>; // You can replace this with a Loader component
    }

    return (
        <div className="event-details-container">
            <h2>{eventName}</h2>
            <p><strong>Organizer Email:</strong> {organizerEmail}</p>
            <h3>Invitees</h3>
            <ul>
                {inviteeEmails.length === 0 ? (
                    <li>No invitees added yet.</li>
                ) : (
                    inviteeEmails.map((email, index) => <li key={index}>{email}</li>)
                )}
            </ul>
            <form onSubmit={handleAddInvitee}>
                <input
                    type="email"
                    name="inviteeEmail"
                    placeholder="Add invitee email"
                    required
                />
                <button type="submit">Add Invitee</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EventDetails;
