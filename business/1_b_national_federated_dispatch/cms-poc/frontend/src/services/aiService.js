import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api';

export const generateAgencyResponse = async (incidentId, userMessage, incidentType, incidentDescription) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/incidents/${incidentId}/ai-response`, {
      userMessage,
      incidentType,
      incidentDescription
    });
    return response.data;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};


