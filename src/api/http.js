import axios from 'axios';

//para usar con interceptores
export const authHttp = axios.create({
  baseURL: 'http://localhost:3000', 
  withCredentials: true,            //save cookies in storage browser
});

export const publicHttp = axios.create({
  baseURL: 'http://localhost:3000', 
  withCredentials: true,            //save cookies in storage browser 
});
