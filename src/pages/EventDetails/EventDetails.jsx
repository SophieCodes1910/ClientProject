import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios"; // Import axios for API calls
import 'react-toastify/dist/ReactToastify.css';
import './EventDetails.css';

export const EventDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract event details from location state
  const { eventName, organizerEmail, description } = location.state || {};

  const [name, setName] = useState(eventName || "");
  const [email, setEmail] = useState(organizerEmail || "");
  const [eventDescription, setEventDescription] = useState(description || "");
  const [mediaFiles, setMediaFiles] = useState([]); // State to store media files
  const [inviteeEmails, setInviteeEmails] = useState([""]); // Start with an empty input for emails
  const [isPublic, setIsPublic] = useState(true); // Toggle for event visibility
  const [schedules, setSchedules] = useState([{ 
    date: "", 
    startTime: "", 
    endTime: "", 
    plans: [{ time: "", description: "" }], // Updated to hold multiple plans
    dressCode: "", 
    location: "",
    whatToBring: "",
    specialInstructions: "",
    showDetails: false, // State to manage visibility of additional details
    showInputs: false // State to manage visibility of input fields
  }]); // State for schedules

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setMediaFiles([...mediaFiles, ...files]); // Append new files to existing files
  };

  const handleInviteeChange = (index, value) => {
    const newEmails = [...inviteeEmails];
    newEmails[index] = value; // Update the specific email based on index
    setInviteeEmails(newEmails);
  };

  const addInviteeEmail = () => {
    setInviteeEmails([...inviteeEmails, ""]); // Add a new empty email input
  };

  const removeInviteeEmail = (index) => {
    const newEmails = inviteeEmails.filter((_, i) => i !== index); // Remove the email at the specified index
    setInviteeEmails(newEmails);
  };

  const removeMediaFile = (index) => {
    const newFiles = mediaFiles.filter((_, i) => i !== index); // Remove the media file at the specified index
    setMediaFiles(newFiles);
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value; // Update the specific field for the given schedule
    setSchedules(newSchedules);
  };

  const handlePlanChange = (scheduleIndex, planIndex, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[scheduleIndex].plans[planIndex][field] = value; // Update the specific plan field
    setSchedules(newSchedules);
  };

  const addPlan = (scheduleIndex) => {
    const newSchedules = [...schedules];
    newSchedules[scheduleIndex].plans.push({ time: "", description: "" }); // Add a new plan for the specified schedule
    setSchedules(newSchedules);
  };

  const removePlan = (scheduleIndex, planIndex) => {
    const newSchedules = [...schedules];
    newSchedules[scheduleIndex].plans = newSchedules[scheduleIndex].plans.filter((_, i) => i !== planIndex); // Remove the plan at the specified index
    setSchedules(newSchedules);
  };

  const addSchedule = () => {
    setSchedules([...schedules, { 
      date: "", 
      startTime: "", 
      endTime: "", 
      plans: [{ time: "", description: "" }], // Start with one empty plan
      dressCode: "", 
      location: "",
      whatToBring: "",
      specialInstructions: "",
      showDetails: false, // Initialize visibility state
      showInputs: false // Initialize visibility of input fields
    }]); // Add a new schedule
  };

  const removeSchedule = (index) => {
    const newSchedules = schedules.filter((_, i) => i !== index); // Remove the schedule at the specified index
    setSchedules(newSchedules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("description", eventDescription);
    formData.append("isPublic", isPublic); // Add visibility status to the form data
    mediaFiles.forEach((file) => {
      formData.append("media", file); // Append each file to the FormData object
    });
    inviteeEmails.forEach((invitee) => {
      if (invitee) {
        formData.append("invitees", invitee); // Append each invitee's email
      }
    });
    schedules.forEach((schedule) => {
      if (schedule.date && schedule.startTime && schedule.endTime) {
        formData.append("schedules", JSON.stringify(schedule)); // Append schedules
      }
    });

    try {
      const response = await axios.post('/api/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type
        },
      });

      if (response.data.success) {
        toast.success("Event updated and invitations sent!"); // Notify the user of success
        navigate('/events/my-invitations'); // Navigate to My Invitations page after successful submission
      } else {
        toast.error("Error updating event."); // Notify user of failure
      }
    } catch (error) {
      toast.error("Error updating event."); // Catch and handle error
      console.error("Error:", error);
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const toggleDetails = (index) => {
    const newSchedules = [...schedules];
    newSchedules[index].showDetails = !newSchedules[index].showDetails; // Toggle the visibility of additional details
    setSchedules(newSchedules);
  };

  const toggleInputs = (index) => {
    const newSchedules = [...schedules];
    newSchedules[index].showInputs = !newSchedules[index].showInputs; // Toggle the visibility of input fields
    setSchedules(newSchedules);
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
                  onChange={(e) => handleScheduleChange(scheduleIndex, 'date', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Time:</label>
                <input
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => handleScheduleChange(scheduleIndex, 'startTime', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Time:</label>
                <input
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) => handleScheduleChange(scheduleIndex, 'endTime', e.target.value)}
                  required
                />
              </div>

              <button type="button" onClick={() => toggleInputs(scheduleIndex)}>
                {schedule.showInputs ? 'Hide Input Details' : 'More'}
              </button>

              {schedule.showInputs && (
                <div className="schedule-details">
                  <div className="form-group">
                    <label>Location:</label>
                    <input
                      type="text"
                      value={schedule.location}
                      onChange={(e) => handleScheduleChange(scheduleIndex, 'location', e.target.value)}
                      placeholder="Location"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Dress Code:</label>
                    <input
                      type="text"
                      value={schedule.dressCode}
                      onChange={(e) => handleScheduleChange(scheduleIndex, 'dressCode', e.target.value)}
                      placeholder="Dress Code"
                    />
                  </div>

                  <div className="form-group">
                    <label>What to Bring:</label>
                    <input
                      type="text"
                      value={schedule.whatToBring}
                      onChange={(e) => handleScheduleChange(scheduleIndex, 'whatToBring', e.target.value)}
                      placeholder="What to Bring"
                    />
                  </div>

                  <div className="form-group">
                    <label>Special Instructions:</label>
                    <input
                      type="text"
                      value={schedule.specialInstructions}
                      onChange={(e) => handleScheduleChange(scheduleIndex, 'specialInstructions', e.target.value)}
                      placeholder="Special Instructions"
                    />
                  </div>

                  <div className="form-group">
                    <label>Plans:</label>
                    {schedule.plans.map((plan, planIndex) => (
                      <div key={planIndex} className="plan" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <input
                          type="time"
                          value={plan.time}
                          onChange={(e) => handlePlanChange(scheduleIndex, planIndex, 'time', e.target.value)}
                          placeholder="Plan Time"
                          required
                          style={{ marginRight: '10px' }} // Spacing between elements
                        />
                        <input
                          type="text"
                          value={plan.description}
                          onChange={(e) => handlePlanChange(scheduleIndex, planIndex, 'description', e.target.value)}
                          placeholder="Plan Description"
                          required
                          style={{ marginRight: '10px', flexGrow: 1 }} // Allows the description input to grow
                        />
                        <button type="button" onClick={() => removePlan(scheduleIndex, planIndex)}>Remove Plan</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addPlan(scheduleIndex)}>Add Another Plan</button>
                  </div>
                </div>
              )}

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
