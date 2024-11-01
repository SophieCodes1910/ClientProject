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

    const [eventName, setEventName] = useState("");
    const [organizerEmail, setOrganizerEmail] = useState("");
    const [description, setDescription] = useState("");
    const [locationName, setLocationName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventStartTime, setEventStartTime] = useState("");
    const [eventEndTime, setEventEndTime] = useState("");
    const [inviteeEmails, setInviteeEmails] = useState([]);
    const [adPlans, setAdPlans] = useState("");
    const [addedPlans, setAddedPlans] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPublic, setIsPublic] = useState(true);
    const [additionalDetailsOpen, setAdditionalDetailsOpen] = useState(false);

    useEffect(() => {
        if (!docId) {
            toast.error("Event details are missing. Please go back and try again.");
            return;
        }

        const fetchEventDetails = async () => {
            try {
                const eventRef = doc(db, "events", docId);
                const docSnap = await getDoc(eventRef);
                if (!docSnap.exists()) {
                    toast.error("No such event found!");
                    return;
                }

                const eventData = docSnap.data();
                setEventName(eventData.eventName || "");
                setOrganizerEmail(eventData.organizerEmail || "");
                setDescription(eventData.description || "");
                setLocationName(eventData.location || "");
                setEventDate(eventData.eventDate || "");
                setEventStartTime(eventData.eventStartTime || "");
                setEventEndTime(eventData.eventEndTime || "");
                setInviteeEmails(eventData.inviteeEmails || []);
                setAdPlans(eventData.adPlans || "");
                setAddedPlans(eventData.addedPlans || []);
                setUploadedFiles(eventData.uploadedFiles || []);
                setIsPublic(eventData.isPublic !== undefined ? eventData.isPublic : true);
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

    return (
        <div className="event-details-container">
            <h2>Event Details</h2>
            <div className="event-info">
                <div><strong>Event Name:</strong> {eventName}</div>
                <div><strong>Organizer Email:</strong> {organizerEmail}</div>
                <div><strong>Description:</strong> {description}</div>
                <div><strong>Location:</strong> {locationName}</div>
                <div><strong>Date:</strong> {eventDate}</div>
                <div><strong>Start Time:</strong> {eventStartTime}</div>
                <div><strong>End Time:</strong> {eventEndTime}</div>
                <h3>Invitees</h3>
                <ul>
                    {inviteeEmails.length === 0 ? (
                        <li>No invitees added yet.</li>
                    ) : (
                        inviteeEmails.map((email, index) => (
                            <li key={index}>{email}</li>
                        ))
                    )}
                </ul>
                <div><strong>Advertisement Plans:</strong> {adPlans}</div>
                <div><strong>Visibility:</strong> {isPublic ? "Public" : "Private"}</div>
                <h3>Added Plans</h3>
                <ul>
                    {addedPlans.length === 0 ? (
                        <li>No plans added yet.</li>
                    ) : (
                        addedPlans.map((plan, index) => (
                            <li key={index}>{plan}</li>
                        ))
                    )}
                </ul>
                <h3>Uploaded Files</h3>
                <ul>
                    {uploadedFiles.length === 0 ? (
                        <li>No files uploaded yet.</li>
                    ) : (
                        uploadedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))
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
                        {addedPlans.map((plan, index) => (
                            <li key={index}>{plan}</li>
                        ))}
                    </ul>
                    <h3>Uploaded Files</h3>
                    <ul>
                        {uploadedFiles.map((file, index) => (
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
