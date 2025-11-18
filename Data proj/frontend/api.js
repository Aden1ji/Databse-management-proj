// API utility functions
const API_BASE = 'http://localhost:3000/api';

async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const errorMsg = data.error || data.message || `API error: ${response.status}`;
      throw new Error(errorMsg);
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// View API functions
async function getView(viewName) {
  return fetchAPI(`/views/${viewName}`);
}

// Station API functions
async function getStations() {
  return fetchAPI('/stations');
}

async function getStation(id) {
  return fetchAPI(`/stations/${id}`);
}

async function createStation(data) {
  return fetchAPI('/stations', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function updateStation(id, data) {
  return fetchAPI(`/stations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

async function deleteStation(id) {
  return fetchAPI(`/stations/${id}`, {
    method: 'DELETE'
  });
}

// User API functions
async function getUsers() {
  return fetchAPI('/users');
}

// Login API functions
async function registerUser(data) {
  return fetchAPI('/login/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function loginUser(data) {
  return fetchAPI('/login/login', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function logoutUser() {
  return fetchAPI('/login/logout', {
    method: 'POST'
  });
}

