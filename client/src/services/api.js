import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust the base URL as needed
});

// Example API call to register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Example API call to login a user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Example API call to get the current user's profile
export const getUserProfile = async (token) => {
  try {
    const response = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Example API call to update user profile
export const updateUserProfile = async (token, updatedData) => {
  try {
    const response = await api.put('/users/me', updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Example API call to get skill matches
export const getSkillMatches = async (token) => {
  try {
    const response = await api.get('/users/matches', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Example API call to send an exchange request
export const sendExchangeRequest = async (token, requestData) => {
  try {
    const response = await api.post('/requests', requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Example API call to get incoming requests
export const getIncomingRequests = async (token) => {
  try {
    const response = await api.get('/requests', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Example API call to accept or reject a request
export const respondToRequest = async (token, requestId, status) => {
  try {
    const response = await api.put(`/requests/${requestId}`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export default api;