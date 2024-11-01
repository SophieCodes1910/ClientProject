// auth.js
import { auth } from "../../firebase"; // Adjust path as necessary
import { onAuthStateChanged } from "firebase/auth";

export const isAuthenticated = () => {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            resolve(!!user); // Returns true if a user is logged in
        });
    });
};
