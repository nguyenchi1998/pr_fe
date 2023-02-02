import axios from 'axios';
import { API_URL, AUTH_URL } from '../config';
import {
  INTERNAL_ERROR,
  PAGE_NOT_FOUND,
  UNAUTHORIZED,
} from './../config/API_CODES';
import {
  getAccessToken,
  getRefreshToken,
  removeAuthToken,
  setAccessToken,
} from './storage';

export const handle500Error = () => {
  window.location.href = `/500`;
};

export const handle404Error = () => {
  window.location.href = `/404`;
};

export const redirectSignIn = () => {
  window.location.href = `/login`;
};

const getNewToken = () => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return new Promise((resolve, reject) => {
    instance
      .post(AUTH_URL.REFRESH_TOKEN, { refresh: getRefreshToken() })
      .then((response) => {
        const newToken = response.data.access;
        setAccessToken(newToken);
        resolve(newToken);
      })
      .catch((error) => {
        removeAuthToken();
        redirectSignIn();
        reject(error);
      });
  });
};

export const baseRequest = () => axios.create({ baseURL: API_URL });

export const request = (responseType = 'json') => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    responseType,
  });
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response) {
        if (error.response.status === PAGE_NOT_FOUND) {
          // handle404Error();
          return Promise.reject(error);
        }
        if (error.response.status === INTERNAL_ERROR) {
          // handle500Error();
          return Promise.reject(error);
        }
        if (
          error.response.status !== UNAUTHORIZED ||
          error.config.url === AUTH_URL.SIGN_IN
        ) {
          return Promise.reject(error);
        }
        const token = await getNewToken();
        const { config } = error;
        config.headers.Authorization = `Bearer ${token}`;
        return await axios.request(config);
      }
      // removeAuthToken();
      return Promise.reject(error);
    },
  );

  return instance;
};
