import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_BACKEND_API,
  withCredentials: true,
});

export default instance;
