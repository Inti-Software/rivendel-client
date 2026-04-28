import axios from 'axios';
import { BASE_URL } from './constants';

//para usar con interceptores
export const authHttp = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,            //save cookies in storage browser
});

export const publicHttp = axios.create({
  baseURL: BASE_URL, 
  withCredentials: true,            //save cookies in storage browser 
});
