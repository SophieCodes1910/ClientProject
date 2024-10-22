//EventDetails.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { db, storage } from "../../firebase"; // Import Firebase config
import { doc, setDoc } from "firebase/firestore"; // Firestore functions
import { ref, uploadBytes } from "firebase/storage"; // Storage functions
import 'react-toastify/dist/ReactToastify.css';
import './EventDetails.css';
import "./index.js";

export const EventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract event details from location state
  const { eventName, organizerEmail, description } = location.state || {};

  const [name, setName] = useState(eventName || "");
  const [email, setEmail] = useState(organizerEmail || "");
  const [eventDescription, setEventDescription] = useState(description || "");
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
      name,
      email,
      description: eventDescription,
      isPublic,
      invitees: inviteeEmails.filter(invitee => invitee), // Filter out empty emails
      schedules: schedules.filter(schedule => schedule.date && schedule.startTime && schedule.endTime), // Filter valid schedules
    };

    // Upload media files to Firebase Storage and create a document in Firestore
    try {
      const eventDocRef = doc(db, "events", name); // Create a reference for the event document
      await setDoc(eventDocRef, eventData); // Add event data to Firestore

      // Upload media files to Storage
      const uploadPromises = mediaFiles.map((file) => {
        const fileRef = ref(storage, `media/${file.name}`); // Create a reference for the file
        return uploadBytes(fileRef, file); // Upload the file
      });

      await Promise.all(uploadPromises); // Wait for all uploads to finish

      toast.success("Event updated and invitations sent!"); 
      navigate('/events/my-invitations'); // Navigate to My Invitations page
    } catch (error) {
      toast.error("Error updating event.");
      console.error("Error:", error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="event-details">
      <h1>Edit Event Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="event-name">Event Name:</label>
          <input
            id="event-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="organizer-email">Organizer Email:</label>
          <input
            id="organizer-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="event-description">Event Description:</label>
          <textarea
            id="event-description"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="media-upload">Upload Media:</label>
          <input
            id="media-upload"
            type="file"
            multiple
            onChange={handleFileChange}
          />
          <div className="uploaded-files">
            {mediaFiles.map((file, index) => (
              <div key={index}>
                {file.name} <button type="button" onClick={() => removeMediaFile(index)}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Invitee Emails:</label>
          {inviteeEmails.map((email, index) => (
            <div key={index} className="invitee-email">
              <input
                type="email"
                value={email}
                onChange={(e) => handleInviteeChange(index, e.target.value)}
                placeholder="Invitee Email"
                required
              />
              <button type="button" onClick={() => removeInviteeEmail(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addInviteeEmail}>Add Another Invitee</button>
        </div>

        <div className="form-group">
          <label>Make Event Public:</label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
          />
        </div>

        <div className="schedules">
          <h4>Event Schedules:</h4>
          {schedules.map((schedule, scheduleIndex) => (
            <div key={scheduleIndex} className="schedule">
              <h5>Schedule {scheduleIndex + 1}</h5>
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  value={schedule.date}
                  onChange={(e) => handleScheduleChange(scheduleIndex, "date", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Start Time:</label>
                <input
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => handleScheduleChange(scheduleIndex, "startTime", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>End Time:</label>
                <input
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) => handleScheduleChange(scheduleIndex, "endTime", e.target.value)}
                />
              </div>
              <button type="button" onClick={() => removeSchedule(scheduleIndex)}>Remove Schedule</button>
            </div>
          ))}
          <button type="button" onClick={addSchedule}>Add Another Schedule</button>
        </div>

        <button type="submit">Submit</button>
        <button type="button" onClick={handleBack}>Back</button>
      </form>

      <ToastContainer />
    </div>
  );
};
