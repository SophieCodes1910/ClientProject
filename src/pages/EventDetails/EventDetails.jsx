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
    const [description, setDescription] = useState("");
    const [locationName, setLocationName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventStartTime, setEventStartTime] = useState("");
    const [eventEndTime, setEventEndTime] = useState("");
    const [inviteeEmails, setInviteeEmails] = useState([]);
    const [newEmail, setNewEmail] = useState("");
    const [additionalDetailsOpen, setAdditionalDetailsOpen] = useState(false);
    const [adPlans, setAdPlans] = useState("");
    const [manualPlan, setManualPlan] = useState("");
    const [addedPlans, setAddedPlans] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPublic, setIsPublic] = useState(true); // New state for visibility

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
                setIsPublic(eventData.isPublic !== undefined ? eventData.isPublic : true); // Set public/private state
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
                description,
                location: locationName,
                eventDate,
                eventStartTime,
                eventEndTime,
                inviteeEmails,
                adPlans,
                addedPlans,
                uploadedFiles,
                isPublic // Include visibility in the update
            });
            toast.success("Event updated successfully!");
        } catch (error) {
            console.error("Error updating event:", error);
            toast.error("Error updating event.");
        }
    };

    const handleAddEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
        if (emailPattern.test(newEmail) && !inviteeEmails.includes(newEmail)) {
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
        const files = Array.from(e.target.files);
        setUploadedFiles(prevFiles => [...prevFiles, ...files]);
    };

    const handleAddPlan = () => {
        const planPattern = /^.+:\s*\d{2}:\d{2}$/; // Ensure the format is 'Description: HH:MM'
        if (planPattern.test(manualPlan)) {
            setAddedPlans(prevPlans => [...prevPlans, manualPlan]);
            setManualPlan("");
        } else {
            toast.error("Plan format should be 'Description: HH:MM'");
        }
    };

    const handleRemovePlan = (planToRemove) => {
        setAddedPlans(addedPlans.filter(plan => plan !== planToRemove));
    };

    if (loading) {
        return <div className="loading-indicator">Loading event details...</div>;
    }

    return (
        <div className="event-details-container">
            <h2>Event Details</h2>
            <form onSubmit={handleUpdateEvent} className="event-form">
                <div className="form-group">
                    <label>Event Name:</label>
                    <input
                        type="text"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Organizer Email:</label>
                    <input
                        type="email"
                        value={organizerEmail}
                        onChange={(e) => setOrganizerEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add event description"
                    />
                </div>

                <div className="form-group">
                    <label>Location:</label>
                    <input
                        type="text"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Start Time:</label>
                    <input
                        type="time"
                        value={eventStartTime}
                        onChange={(e) => setEventStartTime(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>End Time:</label>
                    <input
                        type="time"
                        value={eventEndTime}
                        onChange={(e) => setEventEndTime(e.target.value)}
                        required
                    />
                </div>

                <h3>Invitees</h3>
                <div className="form-group invitee-email">
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Add invitee email"
                    />
                    <button type="button" onClick={handleAddEmail}>Add Email</button>
                </div>
                <ul className="invitee-list">
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

                <div className="form-group visibility-toggle">
                    <label>Event Visibility:</label>
                    <button type="button" className={isPublic ? "active" : ""} onClick={() => setIsPublic(true)}>Public</button>
                    <button type="button" className={!isPublic ? "active" : ""} onClick={() => setIsPublic(false)}>Private</button>
                </div>

                <button
                    type="button"
                    className="toggle-details"
                    onClick={() => setAdditionalDetailsOpen(!additionalDetailsOpen)}
                >
                    {additionalDetailsOpen ? "Close Additional Details" : "Additional Details"}
                </button>

                {additionalDetailsOpen && (
                    <div className="additional-details">
                        <h3>Add Plans</h3>
                        <div className="form-group">
                            <input
                                type="text"
                                value={manualPlan}
                                onChange={(e) => setManualPlan(e.target.value)}
                                placeholder="Description: HH:MM"
                            />
                            <button type="button" onClick={handleAddPlan}>Add Plan</button>
                        </div>

                        <ul className="added-plans-list">
                            {addedPlans.length === 0 ? (
                                <li>No plans added yet.</li>
                            ) : (
                                addedPlans.map((plan, index) => (
                                    <li key={index}>
                                        {plan}
                                        <button type="button" onClick={() => handleRemovePlan(plan)}>Remove</button>
                                    </li>
                                ))
                            )}
                        </ul>

                        <div className="form-group">
                            <label>Upload Files:</label>
                            <input type="file" multiple onChange={handleFileChange} />
                            <ul className="uploaded-files-list">
                                {uploadedFiles.length > 0 && uploadedFiles.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                <button type="submit">Save Changes</button>
            </form>

            <ToastContainer />
        </div>
    );
};

export default EventDetails;