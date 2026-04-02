import axios from 'axios';

//* 📝 para usar con interceptores
export const http = axios.create({
  baseURL: 'http://localhost:3000', 
  withCredentials: true,            //* save cookies in storage browser
});

export const publicHttp = axios.create({
  baseURL: 'http://localhost:3000', 
  withCredentials: true,            // save cookies in storage browser 
});
