import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { db, storage } from '../../firebase'; // Adjust based on your structure

const EventDetails = ({ id }) => {
  // State variables for event details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [inviteeEmails, setInviteeEmails] = useState(['']);
  const [isPublic, setIsPublic] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [furtherInfo, setFurtherInfo] = useState({
    dressCode: '',
    location: '',
    whatToBring: '',
    specialInstructions: '',
  });

  const navigate = useNavigate();

  // Fetch the existing event data when the component mounts
  useEffect(() => {
    const fetchEventData = async () => {
      const eventRef = doc(db, "events", id);
      const eventDoc = await getDoc(eventRef);
      
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        console.log("Fetched Event Data:", eventData); // Debugging line
        
        // Populate the state with fetched data
        setName(eventData.name);
        setEmail(eventData.email);
        setEventDescription(eventData.description);
        setEventStart(eventData.eventStartTime);
        setEventEnd(eventData.eventEndTime);
        setMediaFiles(eventData.mediaFiles || []);
        setInviteeEmails(eventData.invitees || ['']);
        setIsPublic(eventData.isPublic);
        setSchedules(eventData.schedules || []);
        setFurtherInfo({
          dressCode: eventData.dressCode || '',
          location: eventData.location || '',
          whatToBring: eventData.whatToBring || '',
          specialInstructions: eventData.specialInstructions || '',
        });
      } else {
        toast.error("Event not found!");
      }
    };

    fetchEventData();
  }, [id]);

  // Remaining code...

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
              <label>Date</label>
              <input 
                type="date" 
                value={schedule.date} 
                onChange={(e) => handleScheduleChange(index, 'date', e.target.value)} 
              />
              <label>Start Time</label>
              <input 
                type="time" 
                value={schedule.startTime} 
                onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)} 
              />
              <label>End Time</label>
              <input 
                type="time" 
                value={schedule.endTime} 
                onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)} 
              />
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

export default EventDetails;

