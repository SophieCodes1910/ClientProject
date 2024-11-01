import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './eventDetails.css';

const EventDetails = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize navigate
    const { docId } = location.state || {};
    const userEmail = localStorage.getItem("email");
    
    const [eventData, setEventData] = useState({});
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [userRSVP, setUserRSVP] = useState("pending");

    useEffect(() => {
        if (!docId) {
            toast.error("Event details are missing.");
            return;
        }

        const fetchEventDetails = async () => {
            const eventRef = doc(db, "events", docId);
            const docSnap = await getDoc(eventRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setEventData(data);
                setIsOrganizer(data.organizerEmail === userEmail);

                // Check if the user is an invitee and get their RSVP status
                const invitee = data.invitations?.find(inv => inv.email === userEmail);
                setUserRSVP(invitee ? invitee.status : "not invited");
            }
        };
        fetchEventDetails();
    }, [docId, userEmail]);

    const handleRSVP = async (status) => {
        const eventRef = doc(db, "events", docId);
        try {
            await updateDoc(eventRef, {
                invitations: arrayUnion({ email: userEmail, status })
            });
            setUserRSVP(status);
            toast.success(`You have ${status} the invitation.`);
        } catch (error) {
            console.error("Error updating RSVP status:", error);
            toast.error("Error updating RSVP status.");
        }
    };

    const handleEditEvent = () => {
        // Navigate to the edit page, passing along the docId as state
        navigate("/edit-event", { state: { docId } });
    };

    return (
        <div className="event-details-container">
            <h2>{eventData.eventName}</h2>
            <p><strong>Organizer:</strong> {eventData.organizerEmail}</p>
            <p><strong>Description:</strong> {eventData.description}</p>
            <p><strong>Location:</strong> {eventData.location}</p>
            <p><strong>Date:</strong> {eventData.eventDate}</p>
            <p><strong>Time:</strong> {eventData.eventStartTime} - {eventData.eventEndTime}</p>

            {isOrganizer ? (
                <button onClick={handleEditEvent}>Edit Event</button> // Organizer options
            ) : userRSVP === "pending" ? (
                <>
                    <button onClick={() => handleRSVP("accepted")}>Accept</button>
                    <button onClick={() => handleRSVP("declined")}>Decline</button>
                </>
            ) : (
                <p>You have {userRSVP} this invitation.</p>
            )}

            <ToastContainer />
        </div>
    );
};

export default EventDetails;
