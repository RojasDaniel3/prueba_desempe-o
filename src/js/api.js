// === SPA COURSES TEMPLATE ===
// Instructions: Implement the functions to connect to the REST API.
// You can use fetch to make HTTP requests (GET, POST, PUT, DELETE).
// Change the base URL if your API runs on a different port or path.

export const api = {
  base: 'http://localhost:3000', // Change this URL if needed

  // GET request
  get: async param => {
    // Sends a GET request to the API and returns the data
    try {
      const response = await fetch(`${api.base}${param}`);
      if (!response.ok) {
        throw new Error('Error getting data');
      }
      return await response.json(); // Convert the response to JSON
    } catch (error) {
      console.error('GET request error:', error);
      throw error;
    }
  },

  // POST request
  post: async (param, data) => {
    // Sends a POST request with data to the API
    try {
      const response = await fetch(`${api.base}${param}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Send data as JSON
        },
        body: JSON.stringify(data) // Convert data to JSON string
      });
      if (!response.ok) {
        throw new Error('Error creating data');
      }
      return await response.json(); // Return the result
    } catch (error) {
      console.error('POST request error:', error);
      throw error;
    }
  },

  // PUT request
  put: async (p, data) => {
    // Sends a PUT request to update data in the API
    try {
      const response = await fetch(`${api.base}${p}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Error updating data');
      }
      return await response.json();
    } catch (error) {
      console.error('PUT request error:', error);
      throw error;
    }
  },

  // DELETE request
  delete: async p => {
    // Sends a DELETE request to remove data from the API
    try {
      const response = await fetch(`${api.base}${p}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Error deleting data');
      }
      return await response.json();
    } catch (error) {
      console.error('DELETE request error:', error);
      throw error;
    }
  }
};
