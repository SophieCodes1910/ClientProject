import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import toast, {Toaster} from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_API_URL;

import "./login.css";
import {Link} from "react-router-dom";

export const Login = ({setLoggedIn}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(apiUrl + "/auth/login", {
                email,
                password,
            });

            console.log(response.data)


            if (response.data.success) {
                const token = response.data.data.token;
                localStorage.setItem("token", token);
                localStorage.setItem("email", email);
                setLoading(false);
                toast.success('Successfully created!', {
                    position: 'bottom-right'
                });

                setLoggedIn(true);

                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } else {
                setLoading(false);
                toast.error("This didn't work. 1", {
                    position: 'bottom-right'
                })

            }
        } catch (error) {
            if (error.response) {
                console.log(error.response);
                console.log(error)
                if (error.response.status === 500) {
                    setLoading(false);
                    toast.error("Server not working")
                } else if (error.response.status === 400) {
                    setLoading(false);
                    // Handle 400 Bad Request error (e.g., invalid credentials)
                    toast.error("Please register first", {
                        position: 'bottom-right'
                    })
                } else if (error.response.status === 406) {
                    setLoading(false)
                    toast.error("Email or password is incorrect", {
                        position: 'bottom-right'
                    })
                } else if (error.response.status === 401) {
                    setLoading(false);
                    toast.error("Please verify email first", {
                        position: 'bottom-right'
                    })

                }
            } else if (error.request) {
                setLoading(false);
                // Handle network error (e.g., server is down)
                toast.error("This didn't work.")

            } else {
                setLoading(false);
                toast.error("This didn't work. 3")

            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2 style={location.pathname === '/login' ? {} : {color: 'white'}}>Login</h2>
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
                Don't have an account?
                <Link to="/register" className="register-btn">Register</Link>
            </form>
            {/*<ToastContainer/>*/}
        </div>
    );
};
