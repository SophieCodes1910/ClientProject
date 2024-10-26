import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar"; 
import image60th from "../../assets/images/image60th.jpg";
import imageAMconcert from "../../assets/images/imageAMconcert.jpg";
import imageParis from "../../assets/images/imageParis.jpg";
import "./LandingPage.css";

export const LandingPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [data, setData] = useState(null); // State to store fetched data
    const [error, setError] = useState(null); // State to store error if any
    const images = [image60th, imageAMconcert, imageParis];

    // Fetch data from the API
    useEffect(() => {
        fetch('https://4b9b-80-233-47-137.ngrok-free.app', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => setData(data))
        .catch(error => setError(error));
    }, []);

    // Image rotation logic for carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div id="landing-page">
            {/* Render Navbar at the top */}
            <Navbar />

            <div className="hero">
                <h1>Welcome to Huppsi!</h1>
                <p>Create a celebration with one click!</p>

                <div className="how-it-works-container">
                    <h2>How it works!</h2>
                    <div className="how-it-works-content">
                        <div className="how-it-works-text">
                            <p>
                                Planning an event should be exciting, not stressful. Whether you're hosting a wedding, birthday party, corporate event, or any special occasion, we make it easy to create stunning invitations that capture the essence of your celebration.
                            </p>
                        </div>

                        {/* Carousel component */}
                        <div className="how-it-works-images carousel">
                            <div 
                                className="carousel-track"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {images.map((image, index) => (
                                    <img 
                                        key={index} 
                                        src={image} 
                                        alt={`Event image ${index + 1}`} 
                                        className="carousel-image" 
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <h1>Section 2</h1>

                {/* Display fetched data or error message */}
                {error && <p className="error-message">Error: {error.message}</p>}
                {data && (
                    <div>
                        <h2>Fetched Data:</h2>
                        <pre>{JSON.stringify(data, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};