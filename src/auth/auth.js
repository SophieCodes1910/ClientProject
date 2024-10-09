// auth.js
export const isAuthenticated = () => {
    return !!localStorage.getItem('token'); // Returns true if token exists
};
