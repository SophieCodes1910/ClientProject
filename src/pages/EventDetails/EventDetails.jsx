// EventDetails.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './eventDetails.css';

const EventDetails = () => {
    const location = useLocation();
    const { docId } = location.state || {};

    const [eventName, setEventName] = useState("");
    const [organizerEmail, setOrganizerEmail] = useState("");
    const [locationName, setLocationName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventStartTime, setEventStartTime] = useState("");
    const [eventEndTime, setEventEndTime] = useState("");
    const [inviteeEmails, setInviteeEmails] = useState([]);
    const [newEmail, setNewEmail] = useState("");
    const [additionalDetailsOpen, setAdditionalDetailsOpen] = useState(false);
    const [adPlans, setAdPlans] = useState([]);
    const [description, setDescription] = useState("");
    const [time, setTime] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
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
                if (!docSnap.exists()) {
                    toast.error("No such event found!");
                    return;
                }

                const eventData = docSnap.data();
                setEventName(eventData.eventName || "");
                setOrganizerEmail(eventData.organizerEmail || "");
                setLocationName(eventData.location || "");
                setEventDate(eventData.eventDate || "");
                setEventStartTime(eventData.eventStartTime || "");
                setEventEndTime(eventData.eventEndTime || "");
                setInviteeEmails(eventData.inviteeEmails || []);
                setAdPlans(eventData.adPlans || []);
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
                organizerEmail,
                location: locationName,
                eventDate,
                eventStartTime,
                eventEndTime,
                inviteeEmails,
                adPlans,
                uploadedFile
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
            setNewEmail("");
        } else {
            toast.error("Please enter a valid email or avoid duplicates.");
        }
    };

    const handleRemoveEmail = (emailToRemove) => {
        setInviteeEmails(inviteeEmails.filter(email => email !== emailToRemove));
    };

    const handleFileChange = (e) => {
        setUploadedFile(e.target.files[0]);
    };

    const handleAddPlan = () => {
        if (description && time) {
            setAdPlans((prevPlans) => [...prevPlans, { description, time }]);
            setDescription("");
            setTime("");
        } else {
            toast.error("Please enter both description and time.");
        }
    };

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

                <label>Organizer Email:</label>
                <input
                    type="email"
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    required
                />

                <label>Location:</label>
                <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                />

                <label>Date:</label>
                <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                />

                <label>Start Time:</label>
                <input
                    type="time"
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    required
                />

                <label>End Time:</label>
                <input
                    type="time"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    required
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
                        <label>Description:</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                        />

                        <label>Time:</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                        />
                        
                        <button type="button" onClick={handleAddPlan}>Add Plan</button>

                        <ul>
                            {adPlans.length === 0 ? (
                                <li>No plans added yet.</li>
                            ) : (
                                adPlans.map((plan, index) => (
                                    <li key={index}>{plan.description}: {plan.time}</li>
                                ))
                            )}
                        </ul>

                        <label>Upload Schedule (Plans):</label>
                        <input type="file" accept="application/pdf" onChange={handleFileChange} />

                        <label>Import Map:</label>
                        <input type="file" accept="application/pdf" onChange={handleFileChange} />

                        <label>Upload Images and Videos:</label>
                        <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
                    </div>
                )}

                <button type="submit">Update Event</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EventDetails;
