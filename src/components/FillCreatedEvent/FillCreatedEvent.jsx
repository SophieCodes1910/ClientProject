import {useState, useEffect} from "react";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import './fillCreatedEvent.css';

export const FillCreatedEvent = ({data}) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [eventName, setEventName] = useState("");
    const [eventStartTime, setEventStartTime] = useState("");
    const [eventEndTime, setEventEndTime] = useState("");
    const [location, setLocation] = useState("");
    const [note, setNote] = useState("");
    const [instructions, setInstructions] = useState("");
    const organizerEmail = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const [guests, setGuests] = useState([{email: "", name: "", role: "GUEST"}]);
    const [subEvent, setSubEvent] = useState([{
        partName: "",
        startTime: "",
        endTime: "",
        location: "",
        instruction: "",
        note: ""
    }]);
    const [isComplete, setIsComplete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {


        const getEvents = async () => {
            try {
                const response = await axios.get(`${apiUrl}/invitations/invitation/${data.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    const fetchedData = response.data.data;
                    setEventName(fetchedData.eventName || "");
                    setEventStartTime(fetchedData.eventStartTime || "");
                    setEventEndTime(fetchedData.eventEndTime || "");
                    setLocation(fetchedData.location || "");
                    setNote(fetchedData.note || "");
                    setInstructions(fetchedData.instructions || "");
                    setGuests(fetchedData.guests || [{email: "", name: "", role: "GUEST"}]);
                    setSubEvent(fetchedData.subEvent || [{
                        partName: "",
                        startTime: "",
                        endTime: "",
                        location: "",
                        instruction: "",
                        note: ""
                    }]);
                } else {
                    toast.error("Failed to fetch event data.", {
                        position: "bottom-right",
                        autoClose: 3000,
                    });
                }
            } catch (error) {
                console.error("Error fetching event data:", error);
                toast.error("An error occurred while fetching event data.", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
            }
        };

        getEvents();
    }, [data.id, apiUrl, token]);

    useEffect(() => {
        const allFieldsFilled =
            eventName &&
            eventStartTime &&
            eventEndTime &&
            location &&
            instructions &&
            guests.every(guest => guest.email && guest.name && guest.role) &&
            subEvent.every(sub => sub.partName && sub.startTime && sub.endTime && sub.location && sub.instruction && sub.note);

        setIsComplete(allFieldsFilled);
    }, [eventName, eventStartTime, eventEndTime, location, note, instructions, guests, subEvent]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const guestEmailMatch = guests.some(guest => guest.email === organizerEmail);
        if (guestEmailMatch) {
            toast.error("Organizer email cannot be the same as guest email.", {
                position: "bottom-right",
                autoClose: 3000,
            });
            return;
        }

        const eventData = {
            eventName,
            eventStartTime,
            eventEndTime,
            location,
            note,
            instructions,
            organizerEmail,
            guests,
            subEvent,
        };

        try {
            const response = await axios.put(`${apiUrl}/invitations/invitation/${data.id}`, eventData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                toast.success("Event saved successfully!", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                toast.error("Failed to save event.", {
                    position: "bottom-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Error saving event:", error);
            toast.error("An error occurred while saving the event.", {
                position: "bottom-right",
                autoClose: 3000,
            });
        }
    };

    return (
        <>
            <div className="fill-events-container">
                <div className="events">
                    <h2>{isComplete ? "Create Event" : "Save Event"}</h2>
                    <form className="event-form" onSubmit={handleSubmit}>
                        <div className="event-form_top">
                            <div>
                                <label htmlFor="event-name">Event Name:</label>
                                <input
                                    id="event-name"
                                    type="text"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="event-start-time">Start Time:</label>
                                <input
                                    id="event-start-time"
                                    type="datetime-local"
                                    value={eventStartTime}
                                    onChange={(e) => setEventStartTime(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="event-end-time">End Time:</label>
                                <input
                                    id="event-end-time"
                                    type="datetime-local"
                                    value={eventEndTime}
                                    onChange={(e) => setEventEndTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="event-form_middle">
                            <div>
                                <label htmlFor="location">Location:</label>
                                <input
                                    id="location"
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="note">Note:</label>
                                <textarea
                                    id="note"
                                    rows={5}
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="instructions">Instructions:</label>
                                <textarea
                                    id="instructions"
                                    rows={5}
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                />
                            </div>
                        </div>
                        <h3>Guests</h3>
                        <button type="button" className="add-button"
                                onClick={() => setGuests([...guests, {email: "", name: "", role: "GUEST"}])}>
                            Add Guest
                        </button>
                        <div className="guests-container">
                            {guests.map((guest, index) => (
                                <div key={index} className="guest-item">
                                    <label htmlFor={`guest-email-${index}`}>Guest Email:</label>
                                    <input
                                        id={`guest-email-${index}`}
                                        type="email"
                                        value={guest.email}
                                        onChange={(e) => {
                                            const newGuests = [...guests];
                                            newGuests[index].email = e.target.value;
                                            setGuests(newGuests);
                                        }}
                                    />
                                    <label htmlFor={`guest-name-${index}`}>Guest Name:</label>
                                    <input
                                        id={`guest-name-${index}`}
                                        type="text"
                                        value={guest.name}
                                        onChange={(e) => {
                                            const newGuests = [...guests];
                                            newGuests[index].name = e.target.value;
                                            setGuests(newGuests);
                                        }}
                                    />
                                    <label htmlFor={`guest-role-${index}`}>Role:</label>
                                    <select
                                        id={`guest-role-${index}`}
                                        value={guest.role}
                                        onChange={(e) => {
                                            const newGuests = [...guests];
                                            newGuests[index].role = e.target.value;
                                            setGuests(newGuests);
                                        }}
                                    >
                                        <option value="GUEST">GUEST</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                    {guests.length > 1 && (
                                        <button
                                            type="button"
                                            className="remove-button"
                                            onClick={() => setGuests(guests.filter((_, i) => i !== index))}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <h3>Sub-Events</h3>
                        <button type="button" className="add-button" onClick={() => setSubEvent([...subEvent, {
                            partName: "",
                            startTime: "",
                            endTime: "",
                            location: "",
                            instruction: "",
                            note: ""
                        }])}>
                            Add Sub-Event
                        </button>
                        <div className="subevents-container">
                            {subEvent.map((sub, index) => (
                                <div key={index} className="subevent-item">
                                    <label htmlFor={`sub-name-${index}`}>Part Name:</label>
                                    <input
                                        id={`sub-name-${index}`}
                                        type="text"
                                        value={sub.partName}
                                        onChange={(e) => {
                                            const newSubEvent = [...subEvent];
                                            newSubEvent[index].partName = e.target.value;
                                            setSubEvent(newSubEvent);
                                        }}
                                    />
                                    <label htmlFor={`sub-start-time-${index}`}>Start Time:</label>
                                    <input
                                        id={`sub-start-time-${index}`}
                                        type="datetime-local"
                                        value={sub.startTime}
                                        onChange={(e) => {
                                            const newSubEvent = [...subEvent];
                                            newSubEvent[index].startTime = e.target.value;
                                            setSubEvent(newSubEvent);
                                        }}
                                    />
                                    <label htmlFor={`sub-end-time-${index}`}>End Time:</label>
                                    <input
                                        id={`sub-end-time-${index}`}
                                        type="datetime-local"
                                        value={sub.endTime}
                                        onChange={(e) => {
                                            const newSubEvent = [...subEvent];
                                            newSubEvent[index].endTime = e.target.value;
                                            setSubEvent(newSubEvent);
                                        }}
                                    />
                                    <label htmlFor={`sub-location-${index}`}>Location:</label>
                                    <input
                                        id={`sub-location-${index}`}
                                        type="text"
                                        value={sub.location}
                                        onChange={(e) => {
                                            const newSubEvent = [...subEvent];
                                            newSubEvent[index].location = e.target.value;
                                            setSubEvent(newSubEvent);
                                        }}
                                    />
                                    <label htmlFor={`sub-instruction-${index}`}>Instruction:</label>
                                    <textarea
                                        id={`sub-instruction-${index}`}
                                        rows={3}
                                        value={sub.instruction}
                                        onChange={(e) => {
                                            const newSubEvent = [...subEvent];
                                            newSubEvent[index].instruction = e.target.value;
                                            setSubEvent(newSubEvent);
                                        }}
                                    />
                                    <label htmlFor={`sub-note-${index}`}>Note:</label>
                                    <textarea
                                        id={`sub-note-${index}`}
                                        rows={3}
                                        value={sub.note}
                                        onChange={(e) => {
                                            const newSubEvent = [...subEvent];
                                            newSubEvent[index].note = e.target.value;
                                            setSubEvent(newSubEvent);
                                        }}
                                    />
                                    {subEvent.length > 1 && (
                                        <button
                                            type="button"
                                            className="remove-button"
                                            onClick={() => setSubEvent(subEvent.filter((_, i) => i !== index))}
                                        >
                                            Remove Sub-Event
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button className="create-event" type="submit">
                            {isComplete ? "Create Event" : "Save"}
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer/>
        </>
    );
};
