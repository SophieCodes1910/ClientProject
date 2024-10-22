//Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { signInWithEmailAndPassword } from "firebase/auth";  
import { auth } from "../../firebase"; 
import PropTypes from 'prop-types';
import "./login.css";
import "./index.js";

export const Login = ({ setLoggedIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            localStorage.setItem("email", email);
            setLoggedIn(true); 
    
            toast.success("Login successful!", {
                position: 'bottom-right'
            });
    
            setTimeout(() => {
                navigate("/"); 
            }, 3000);
        } catch (error) {
            cconsole.error("Login error:", error);
            console.log("Error code:", error.code);
            console.log("Error message:", error.message);
            
            
            switch (error.code) {
                case 'auth/user-not-found':
                    toast.error("User not found. Please register.", { position: 'bottom-right' });
                    break;
                case 'auth/wrong-password':
                    toast.error("Incorrect password. Please try again.", { position: 'bottom-right' });
                    break;
                case 'auth/too-many-requests':
                    toast.error("Too many attempts. Try again later.", { position: 'bottom-right' });
                    break;
                case 'auth/invalid-email':
                    toast.error("Invalid email format.", { position: 'bottom-right' });
                    break;
                case 'auth/network-request-failed':
                    toast.error("Network error. Please check your connection.", { position: 'bottom-right' });
                    break;
                default:
                    toast.error(`Login failed: ${error.message}`, { position: 'bottom-right' });
                    break;
            }
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="login-container">
            <h2 style={{ color: window.location.pathname === '/login' ? 'black' : 'white' }}>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading} className={loading ? "loading" : ""}>
                    {loading ? <span className="loader"></span> : "Login"}
                </button>
                <p>Don't have an account? 
                    <Link to="/register" className="register-btn"> Register</Link>
                </p>
            </form>
        </div>
    );
};

Login.propTypes = {
    setLoggedIn: PropTypes.func.isRequired,
};
