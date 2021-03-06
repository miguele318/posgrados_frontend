import axios from 'axios';
const API_URL = 'http://mdquilindo.pythonanywhere.com';

export const CreateUserService = user => {
  const url = `${API_URL}/api/auth/create_user`;
  return axios.post(url, user);
};
export const ConsultUserServiceForId = id => {
  const url = `${API_URL}/api/auth/consult_user/${id}`;
  return axios.get(url);
};

export const ConsultUserService = () => {
  const url = `${API_URL}/api/auth/consult_user`;
  return axios.get(url);
};