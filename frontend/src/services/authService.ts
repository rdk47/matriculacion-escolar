import apiClient from './apiClient';

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    username: string;
    is_admin: boolean;
  };
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/inscripcion/auth/login/', {
    username,
    password
  });
  return response.data;
};

export const verifyToken = async () => {
  const response = await apiClient.get('/inscripcion/auth/verify/');
  return response.data;
};

export const logout = async () => {
  await apiClient.post('/inscripcion/auth/logout/');
  localStorage.removeItem('token');
};
