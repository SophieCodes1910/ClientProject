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

    // Existing state
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
    const [loading, setLoading] = useState(true);
    const [isPublic, setIsPublic] = useState(true);

    // New states for uploads
    const [scheduleFile, setScheduleFile] = useState(null);
    const [mapFile, setMapFile] = useState(null);
    const [mediaFiles, setMediaFiles] = useState([]);

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
                isPublic,
                scheduleFile,
                mapFile,
                mediaFiles
            });
            toast.success("Event updated successfully!");
        } catch (error) {
            console.error("Error updating event:", error);
            toast.error("Error updating event.");
        }
    };

    const handleScheduleFileChange = (e) => setScheduleFile(e.target.files[0]);
    const handleMapFileChange = (e) => setMapFile(e.target.files[0]);
    const handleMediaFilesChange = (e) => setMediaFiles(Array.from(e.target.files));

    if (loading) {
        return <div className="loading-indicator">Loading event details...</div>;
    }

    return (
        <div className="event-details-container">
            <h2>Event Details</h2>
            <form onSubmit={handleUpdateEvent} className="event-form">
                {/* Other form fields */}
                <div className="form-group">
                    <label>Schedule (PDF):</label>
                    <input type="file" accept="application/pdf" onChange={handleScheduleFileChange} />
                    {scheduleFile && <p>{scheduleFile.name}</p>}
                </div>

                <div className="form-group">
                    <label>Location Map:</label>
                    <input type="file" accept="image/*" onChange={handleMapFileChange} />
                    {mapFile && <p>{mapFile.name}</p>}
                </div>

                <div className="form-group">
                    <label>Photos/Videos:</label>
                    <input type="file" accept="image/*,video/*" multiple onChange={handleMediaFilesChange} />
                    <ul>
                        {mediaFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>

                <button type="submit">Save Changes</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default EventDetails;
