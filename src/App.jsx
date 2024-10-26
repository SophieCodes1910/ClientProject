//App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import logo from "./assets/logo.png";
import "./App.css";
import { Navbar } from "./components/Navbar/Navbar.jsx";
import { LandingPage } from "./pages/LandingPage/LandingPage.jsx"; 
import { Home } from "./pages/Home/Home.jsx";
import { Contact } from "./pages/Contact/Contact.jsx";
import { Login } from "./pages/Login/Login.jsx";
import { Register } from "./pages/Register/Register.jsx";
import toast, { Toaster } from 'react-hot-toast';
import { MyErrorBoundary } from "./components/MyErrorBoundary/MyErrorBoundary.jsx";
import { CreateEvents } from "./pages/CreateEvents/CreateEvents.jsx";
import { MyInvitations } from "./pages/MyInvitaions/MyInvitations.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { isAuthenticated } from "./auth/auth.js";
import { FillCreatedEvent } from "./components/FillCreatedEvent/FillCreatedEvent.jsx";
import EventDetails from './pages/EventDetails/EventDetails.jsx';


export const App = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [route, setRoute] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Add state for login status

    useEffect(() => {
        const fetchEvents = async () => {
            const organizerEmail = localStorage.getItem("email");
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(`${apiUrl}/invitations/organizer/${organizerEmail}/events`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.success) {
                    setRoute(response.data.data);
                } else {
                    toast.error("Failed to fetch events: " + response.data.message);
                }
            } catch (error) {
                toast.error("An error occurred while fetching events. Please try again.");
            }
        };

        if (isAuthenticated()) {
            setIsLoggedIn(true); // Update login status if authenticated
            fetchEvents();
        }
    }, []);

    return (
        <MyErrorBoundary>
            <div className="app">
                <Router>
                    <Navbar logo={logo} />
                    <Routes>
                        {/* Default route now opens LandingPage */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/home" element={<Home route={route} setRoute={setRoute} />} />
                        <Route path="/events/create-events" element={<CreateEvents />} />
                        <Route path="/events/my-invitations" element={<MyInvitations />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login setLoggedIn={setIsLoggedIn} />} /> {/* Pass setLoggedIn */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/EventDetails" element={<EventDetails />} />
                        {
                            route.map((event) => (
                                <Route 
                                    key={event.id} 
                                    path={`/events/event/${event.id}`} 
                                    element={<FillCreatedEvent data={event} />} 
                                />
                            ))
                        }
                    </Routes>
                </Router>
                <Toaster />
            </div>
        </MyErrorBoundary>
    );
};
