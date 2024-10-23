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
  const [mediaFiles, setMediaFiles] = useState([]); // Main media files for the event
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
    mediaFiles: [], // Store media files for each schedule
  }]);

  const [furtherInfo, setFurtherInfo] = useState({
    dressCode: "",
    location: "",
    whatToBring: "",
    specialInstructions: ""
  });

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
      mediaFiles: [], // Reset mediaFiles for the new schedule
    }]);
  };

  const handleFurtherInfoChange = (field, value) => {
    setFurtherInfo({ ...furtherInfo, [field]: value });
  };

  const togglePlan = (field) => {
    const updatedSchedules = [...schedules];
    const existingPlanIndex = updatedSchedules[0].plans.findIndex(plan => plan.description === furtherInfo[field]);

    if (existingPlanIndex >= 0) {
      // If plan exists, remove it
      updatedSchedules[0].plans.splice(existingPlanIndex, 1);
    } else {
      // If plan does not exist, add it
      updatedSchedules[0].plans.push({ time: "", description: furtherInfo[field] });
    }
    setSchedules(updatedSchedules);
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
        
        {/* Further Information Section */}
        <div>
          <h3>Further Information</h3>
          <div>
            <label>Dress Code</label>
            <input 
              type="text" 
              value={furtherInfo.dressCode} 
              onChange={(e) => handleFurtherInfoChange('dressCode', e.target.value)} 
            />
            <button type="button" onClick={() => togglePlan('dressCode')}>
              {schedules[0]?.plans.some(plan => plan.description === furtherInfo.dressCode) ? 'Remove from Plans' : 'Add to Plans'}
            </button>
          </div>
          <div>
            <label>Location</label>
            <input 
              type="text" 
              value={furtherInfo.location} 
              onChange={(e) => handleFurtherInfoChange('location', e.target.value)} 
            />
            <button type="button" onClick={() => togglePlan('location')}>
              {schedules[0]?.plans.some(plan => plan.description === furtherInfo.location) ? 'Remove from Plans' : 'Add to Plans'}
            </button>
          </div>
          <div>
            <label>What to Bring</label>
            <input 
              type="text" 
              value={furtherInfo.whatToBring} 
              onChange={(e) => handleFurtherInfoChange('whatToBring', e.target.value)} 
            />
            <button type="button" onClick={() => togglePlan('whatToBring')}>
              {schedules[0]?.plans.some(plan => plan.description === furtherInfo.whatToBring) ? 'Remove from Plans' : 'Add to Plans'}
            </button>
          </div>
          <div>
            <label>Special Instructions</label>
            <textarea 
              value={furtherInfo.specialInstructions} 
              onChange={(e) => handleFurtherInfoChange('specialInstructions', e.target.value)} 
            />
            <button type="button" onClick={() => togglePlan('specialInstructions')}>
              {schedules[0]?.plans.some(plan => plan.description === furtherInfo.specialInstructions) ? 'Remove from Plans' : 'Add to Plans'}
            </button>
          </div>
        </div>

        {/* Schedules Section */}
        <div>
          <h3>Schedules</h3>
          {schedules.map((schedule, index) => (
            <div key={index}>
              <div>
                <label>Date</label>
                <input type="date" value={schedule.date} onChange={(e) => handleScheduleChange(index, "date", e.target.value)} />
              </div>
              <div>
                <label>Start Time</label>
                <input type="time" value={schedule.startTime} onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)} />
              </div>
              <div>
                <label>End Time</label>
                <input type="time" value={schedule.endTime} onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)} />
              </div>
              <div>
                <label>Plans</label>
                {schedule.plans.map((plan, planIndex) => (
                  <div key={planIndex}>
                    <input
                      type="time"
                      placeholder="Time"
                      value={plan.time}
                      onChange={(e) => {
                        const newPlans = [...schedules[index].plans];
                        newPlans[planIndex].time = e.target.value;
                        const updatedSchedules = [...schedules];
                        updatedSchedules[index].plans = newPlans;
                        setSchedules(updatedSchedules);
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={plan.description}
                      onChange={(e) => {
                        const newPlans = [...schedules[index].plans];
                        newPlans[planIndex].description = e.target.value;
                        const updatedSchedules = [...schedules];
                        updatedSchedules[index].plans = newPlans;
                        setSchedules(updatedSchedules);
                      }}
                    />
                    <button type="button" onClick={() => {
                      const newPlans = [...schedules[index].plans];
                      newPlans.splice(planIndex, 1);
                      const updatedSchedules = [...schedules];
                      updatedSchedules[index].plans = newPlans;
                      setSchedules(updatedSchedules);
                    }}>Remove Plan</button>
                  </div>
                ))}
                <button type="button" onClick={() => {
                  const newPlans = [...schedules[index].plans, { time: "", description: "" }];
                  const updatedSchedules = [...schedules];
                  updatedSchedules[index].plans = newPlans;
                  setSchedules(updatedSchedules);
                }}>Add Plan</button>
              </div>

              {/* Media Files for Schedule */}
              <label>Schedule Media Files</label>
              <input type="file" multiple onChange={(e) => handleScheduleFileChange(index, e)} />
              <div>
                {schedule.mediaFiles.map((file, fileIndex) => (
                  <div key={fileIndex}>
                    {file.name} <button type="button" onClick={() => removeScheduleMediaFile(index, fileIndex)}>Remove</button>
                  </div>
                ))}
              </div>
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
