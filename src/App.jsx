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
import GuestEventDetails from './pages/GuestEventDetails/GuestEventDetails.jsx';

export const App = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [route, setRoute] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            setIsLoggedIn(true);
            fetchEvents();
        }
    }, []);

    return (
        <MyErrorBoundary>
            <div className="app">
                <Router>
                    <Navbar logo={logo} />
                    <Routes>
                        <Route path="/ClientProject" element={<LandingPage />} />
                        <Route path="/home" element={<Home route={route} setRoute={setRoute} />} />
                        <Route path="/EventDetails" element={<EventDetails />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/create" element={<CreateEvents />} />
                        <Route path="/my-invitations" element={<MyInvitations />} />
                        <Route path="/events/event/:eventId" element={<GuestEventDetails />} /> {/* Place this route before the wildcard */}
                        <Route path="*" element={<LandingPage />} /> {/* Wildcard route should be last */}
                    </Routes>
                    <Toaster />
                </Router>
            </div>
        </MyErrorBoundary>
    );
};
