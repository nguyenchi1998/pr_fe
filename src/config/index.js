export const API_HOST = import.meta.env.VITE_APP_API_HOST;
export const API_PORT = import.meta.env.VITE_APP_API_PORT;
export const API_VERSION = import.meta.env.VITE_APP_API_VERSION;

export const API_URL = `${API_HOST}:${API_PORT}/${API_VERSION}`;

export const AUTH_API = {
  SIGN_IN: `/auth/login`,
  REFRESH_TOKEN: `/auth/token/refresh`,
  SIGN_UP: `/auth/register`,
  FETCH_AUTH: '/auth/profile'
}
