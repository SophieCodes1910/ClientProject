import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EditEventStyles.css";

const EventDetails = () => {
    const location = useLocation();
    const { docId } = location.state || {};

    const [eventName, setEventName] = useState("");
    const [organizerUsername, setOrganizerUsername] = useState("");
    const [description, setDescription] = useState("");
    const [locationName, setLocationName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventStartTime, setEventStartTime] = useState("");
    const [inviteeEmails, setInviteeEmails] = useState([]);
    const [newEmail, setNewEmail] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [scheduleFile, setScheduleFile] = useState(null);
    const [mapFile, setMapFile] = useState(null);
    const [mediaFiles, setMediaFiles] = useState([]);
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
                if (docSnap.exists()) {
                    const eventData = docSnap.data();
                    setEventName(eventData.eventName || "");
                    setOrganizerUsername(eventData.organizerUsername || "");
                    setDescription(eventData.description || "");
                    setLocationName(eventData.location || "");
                    setEventDate(eventData.eventDate || "");
                    setEventStartTime(eventData.eventStartTime || "");
                    setInviteeEmails(eventData.inviteeEmails || []);
                    setAdditionalInfo(eventData.additionalInfo || "");
                    setIsPrivate(eventData.isPrivate || false);
                } else {
                    toast.error("No such event found!");
                }
            } catch (error) {
                toast.error("Error fetching event details.");
                console.error("Error fetching event details:", error);
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
                organizerUsername,
                description,
                location: locationName,
                eventDate,
                eventStartTime,
                inviteeEmails,
                additionalInfo,
                isPrivate,
                scheduleFile,
                mapFile,
                mediaFiles,
            });
            toast.success("Event updated successfully!");
        } catch (error) {
            toast.error("Error updating event.");
            console.error("Error updating event:", error);
        }
    };

    const handleEmailChange = () => {
        if (newEmail && !inviteeEmails.includes(newEmail)) {
            setInviteeEmails([...inviteeEmails, newEmail]);
            setNewEmail("");
        }
    };

    const handleRemoveEmail = (index) => {
        setInviteeEmails(inviteeEmails.filter((_, i) => i !== index));
    };

    const handleScheduleFileChange = (e) => setScheduleFile(e.target.files[0]);
    const handleMapFileChange = (e) => setMapFile(e.target.files[0]);
    const handleMediaFilesChange = (e) => setMediaFiles(Array.from(e.target.files));

    if (loading) return <div className="loading-indicator">Loading event details...</div>;

    return (
        <div className="event-details-container">
            <h2>Edit Event</h2>
            <form onSubmit={handleUpdateEvent} className="event-form">
                <div className="form-group">
                    <label>Event Name:</label>
                    <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Organizer:</label>
                    <input type="text" value={organizerUsername} onChange={(e) => setOrganizerUsername(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" required />
                </div>

                <div className="form-group">
                    <label>Date:</label>
                    <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Start Time:</label>
                    <input type="time" value={eventStartTime} onChange={(e) => setEventStartTime(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Location:</label>
                    <input type="text" value={locationName} onChange={(e) => setLocationName(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Private Event:</label>
                    <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
                </div>

                <div className="form-group">
                    <label>Invitees (Email addresses):</label>
                    <textarea
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter email addresses"
                    />
                    <button type="button" onClick={handleEmailChange}>Add Email</button>
                    <ul>
                        {inviteeEmails.map((email, index) => (
                            <li key={index}>
                                {email} <button type="button" onClick={() => handleRemoveEmail(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="form-group">
                    <label>Upload Event Schedule (PDF):</label>
                    <input type="file" accept="application/pdf" onChange={handleScheduleFileChange} />
                    {scheduleFile && <p>{scheduleFile.name}</p>}
                </div>

                <div className="form-group">
                    <label>Upload Map (Image):</label>
                    <input type="file" accept="image/*" onChange={handleMapFileChange} />
                    {mapFile && <p>{mapFile.name}</p>}
                </div>

                <div className="form-group">
                    <label>Upload Photos/Videos:</label>
                    <input type="file" accept="image/*, video/*" multiple onChange={handleMediaFilesChange} />
                    <ul>
                        {mediaFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>

                <div className="form-group">
                    <label>Additional Information:</label>
                    <textarea value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} rows="4" placeholder="Dress code, what to bring, etc." />
                </div>

                <button type="submit">Update Event</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EventDetails;
