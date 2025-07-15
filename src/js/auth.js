// === SPA COURSES TEMPLATE ===
// Instructions: Implement the authentication logic here.
// You can use localStorage to save the logged-in user.
// Use the API (api.js) to fetch and register users.

import { api } from './api.js'; // This module handles API requests

export const auth = {
  // Login function
  login: async (email, pass) => {
    // Get users with the given email from the API
    const users = await api.get(`/users?email=${email}`);

    // If no user found or password doesn't match, throw an error
    if (users.length === 0 || users[0].password !== pass) {
      throw new Error('Invalid credentials');
    }

    const user = users[0];
    // Save the user in localStorage
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Register function
  register: async (name, email, pass, role = "visitor") => {
    // Check if the email already exists in the API
    const existingUser = await api.get(`/users?email=${email}`);
    if (existingUser.length > 0) {
      throw new Error('Email is already registered');
    }

    // If not registered, create a new user and save it
    const newUser = { name, email, password: pass, roleID: "2", role };
    await api.post('/users', newUser); // Save user to API
  },

  // Logout function
  logout: () => {
    // Remove user from localStorage and go to login page
    localStorage.removeItem('user');
    location.hash = '#/login';
  },

  // Check if user is logged in
  isAuthenticated: () => {
    // Returns true if there is a user in localStorage
    return !!localStorage.getItem('user');
  },

  // Get the logged-in user
  getUser: () => {
    // Get user from localStorage and parse it
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
