import {useState, useEffect} from 'react';
import video from '../../assets/backgroundVideo.mp4';
import './home.css';
import {Login} from "../Login/Login";
import {isAuthenticated} from "../../auth/auth";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {Loader} from "../../components/Loader/Loader.jsx";
import {Link, useNavigate} from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export const Home = ({route, setRoute}) => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(isAuthenticated());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [homeRoute, setHomeRoute] = useState([])

    const updateRoutes = (data) => {
        setRoute(data)
    }


    // Function to fetch events
    const fetchEvents = async () => {
        const organizerEmail = localStorage.getItem("email");
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/invitations/organizer/${organizerEmail}/events`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setEvents(response.data.data);
                setLoading(false);
                updateRoutes(response.data.data)

            } else {
                toast.error("Failed to fetch events: " + response.data.message, {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            toast.error("An error occurred while fetching events. Please try again.", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    // Function to handle event deletion
    const handleDelete = async (eventId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.delete(`${apiUrl}/invitations/invitation/${eventId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                toast.success("Event deleted successfully.", {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                // Remove the deleted event from the events state
                setEvents(events.filter(event => event.id !== eventId));
            } else {
                toast.error("Failed to delete event: " + response.data.message, {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error("An error occurred while deleting the event. Please try again.", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    // Use effect to fetch events when component mounts or loggedIn state changes
    useEffect(() => {
        if (loggedIn) {
            fetchEvents();
        }
    }, [loggedIn]);

    return (
        <div className={events.length > 0 ? 'home-container' : "no-events-container"}>
            {
                loading ? <Loader/> : <div>
                    {loggedIn ? (
                        <div className="home-content">
                            <div className="events-grid">
                                {events.length > 0 ? (
                                    events.reverse().map(event => {
                                            return (
                                                <div key={event.id}>
                                                    <div className="event-card">
                                                        <button className="delete-button"
                                                                onClick={() => handleDelete(event.id)}>X
                                                        </button>
                                                        <Link to={`/events/event/${event.id}`}>
                                                            <h3>{event.eventName}</h3>
                                                        </Link>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    )
                                ) : (
                                    <div className="no-events">
                                        <h3>No events found.</h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Login setLoggedIn={setLoggedIn}/>
                    )}
                </div>
            }
            <ToastContainer/>
        </div>
    );
};
