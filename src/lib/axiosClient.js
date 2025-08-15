import axios from 'axios';

let getValidAccessToken = null;
let onUnauthorized = null;

export function bindAuthHelpers(helpers) {
  getValidAccessToken = helpers.getValidAccessToken;
  onUnauthorized = helpers.onUnauthorized;
}

const api = axios.create({
  baseURL: 'https://api.velia.se/api/v1'
});

// Attach Authorization for each request
api.interceptors.request.use(async (config) => {
  if (getValidAccessToken) {
    const token = await getValidAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set for:', config.url);
    } else {
      console.log('No valid token available for:', config.url);
    }
  }
  return config;
});

// Retry once on 401 after refresh
api.interceptors.response.use(
  res => res,
  async (error) => {
    const original = error.config;
    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true;
      if (getValidAccessToken) {
        const t = await getValidAccessToken();
        if (t) {
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${t}`;
          return api.request(original);
        }
      }
      if (onUnauthorized) onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default api;