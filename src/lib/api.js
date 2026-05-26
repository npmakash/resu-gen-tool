const API_BASE_URL = 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong with the request.');
  }
  return data;
};

export const api = {
  // Authentication API calls
  auth: {
    sendOtp: async (email, name = '', password = '', isLogin = true) => {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, isLogin })
      });
      return handleResponse(response);
    },

    verifyOtp: async (email, otp) => {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      return handleResponse(response);
    },

    forgotPassword: async (email) => {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return handleResponse(response);
    },

    resetPassword: async (email, otp, newPassword) => {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      return handleResponse(response);
    }
  },

  // Resumes CRUD API calls
  resumes: {
    list: async (userId) => {
      const response = await fetch(`${API_BASE_URL}/resumes`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': userId
        }
      });
      return handleResponse(response);
    },

    create: async (userId, title) => {
      const response = await fetch(`${API_BASE_URL}/resumes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': userId
        },
        body: JSON.stringify({ title })
      });
      return handleResponse(response);
    },

    update: async (userId, id, resumeData) => {
      const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': userId
        },
        body: JSON.stringify(resumeData)
      });
      return handleResponse(response);
    },

    delete: async (userId, id) => {
      const response = await fetch(`${API_BASE_URL}/resumes/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'user-id': userId
        }
      });
      return handleResponse(response);
    }
  }
};
