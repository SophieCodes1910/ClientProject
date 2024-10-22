import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { db, storage } from "../../firebase"; // Import Firebase config
import { doc, setDoc } from "firebase/firestore"; // Firestore functions
import { ref, uploadBytes } from "firebase/storage"; // Storage functions
import 'react-toastify/dist/ReactToastify.css';
import './EventDetails.css';

export const EventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract event details from location state
  const { id, eventName, organizerEmail, description, eventStartTime, eventEndTime, note } = location.state || {};

  const [name, setName] = useState(eventName || "");
  const [email, setEmail] = useState(organizerEmail || "");
  const [eventDescription, setEventDescription] = useState(description || "");
  const [eventStart, setEventStart] = useState(eventStartTime || "");
  const [eventEnd, setEventEnd] = useState(eventEndTime || "");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [inviteeEmails, setInviteeEmails] = useState([""]);
  const [isPublic, setIsPublic] = useState(true);
  const [schedules, setSchedules] = useState([{ 
    date: "", 
    startTime: "", 
    endTime: "", 
    plans: [{ time: "", description: "" }],
    dressCode: "", 
    location: "",
    whatToBring: "",
    specialInstructions: "",
    showDetails: false,
    showInputs: false 
  }]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles([...mediaFiles, ...files]);
  };

  const handleInviteeChange = (index, value) => {
    const newEmails = [...inviteeEmails];
    newEmails[index] = value;
    setInviteeEmails(newEmails);
  };

  const addInviteeEmail = () => {
    setInviteeEmails([...inviteeEmails, ""]);
  };

  const removeInviteeEmail = (index) => {
    const newEmails = inviteeEmails.filter((_, i) => i !== index);
    setInviteeEmails(newEmails);
  };

  const removeMediaFile = (index) => {
    const newFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(newFiles);
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };

  const addSchedule = () => {
    setSchedules([...schedules, { 
      date: "", 
      startTime: "", 
      endTime: "", 
      plans: [{ time: "", description: "" }],
      dressCode: "", 
      location: "",
      whatToBring: "",
      specialInstructions: "",
      showDetails: false,
      showInputs: false 
    }]);
  };

  const removeSchedule = (index) => {
    const newSchedules = schedules.filter((_, i) => i !== index);
    setSchedules(newSchedules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new event object
    const eventData = {
      id, // Include the ID to update the existing document
      name,
      email,
      description: eventDescription,
      eventStartTime: eventStart,
      eventEndTime: eventEnd,
      mediaFiles: mediaFiles.map(file => file.name), // Store file names for reference
      invitees: inviteeEmails,
      isPublic,
      schedules,
      note,
    };

    // Update event in Firestore
    const eventRef = doc(db, "events", id); // Reference to the event document
    await setDoc(eventRef, eventData);

    // Handle media file uploads if any
    mediaFiles.forEach(file => {
      const fileRef = ref(storage, `events/${id}/${file.name}`);
      uploadBytes(fileRef, file).then(() => {
        console.log("Uploaded file: ", file.name);
      });
    });

    toast.success("Event updated successfully!");
    navigate("/my-invitations"); // Navigate back to MyInvitations after editing
  };

  return (
    <div className="event-details-container">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields for event details */}
        <div>
          <label>Event Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Organizer Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Description</label>
          <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
        </div>
        <div>
          <label>Start Time</label>
          <input type="datetime-local" value={eventStart} onChange={(e) => setEventStart(e.target.value)} required />
        </div>
        <div>
          <label>End Time</label>
          <input type="datetime-local" value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} required />
        </div>
        <div>
          <label>Media Files</label>
          <input type="file" multiple onChange={handleFileChange} />
          <div>
            {mediaFiles.map((file, index) => (
              <div key={index}>
                {file.name} <button type="button" onClick={() => removeMediaFile(index)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label>Invitee Emails</label>
          {inviteeEmails.map((email, index) => (
            <div key={index}>
              <input type="email" value={email} onChange={(e) => handleInviteeChange(index, e.target.value)} />
              <button type="button" onClick={() => removeInviteeEmail(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addInviteeEmail}>Add Invitee</button>
        </div>
        <div>
          <label>Is Public</label>
          <input type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
        </div>
        <div>
          <h3>Schedules</h3>
          {schedules.map((schedule, index) => (
            <div key={index}>
              <label>Date</label>
              <input type="date" value={schedule.date} onChange={(e) => handleScheduleChange(index, "date", e.target.value)} />
              <label>Start Time</label>
              <input type="time" value={schedule.startTime} onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)} />
              <label>End Time</label>
              <input type="time" value={schedule.endTime} onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)} />
              {/* More schedule fields can go here */}
              <button type="button" onClick={() => removeSchedule(index)}>Remove Schedule</button>
            </div>
          ))}
          <button type="button" onClick={addSchedule}>Add Schedule</button>
        </div>
        <button type="submit">Update Event</button>
      </form>
      <ToastContainer />
    </div>
  );
};
