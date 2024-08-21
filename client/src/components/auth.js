// auth.js
export const setToken = (token) => {
    localStorage.setItem('access_token', token);
  };
// Function to get the stored token
export const getToken = () => {
    return localStorage.getItem('access_token');
  };
  
  // Function to remove the token (e.g., for logout)
  export const removeToken = () => {
    localStorage.removeItem('access_token');
  };
  