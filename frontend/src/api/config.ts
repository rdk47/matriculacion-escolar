const isProduction = import.meta.env.PROD;
const backendUrl = isProduction 
  ? 'https://matriculacion-backend.onrender.com' 
  : 'http://localhost:8000';

export const API_BASE_URL = `${backendUrl}/api`;
