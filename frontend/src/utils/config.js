import axios from 'axios';

const BASE_URL = "https://student-managment-system-j3al.onrender.com";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refresh_token');  // Use your key here
  
        if (refreshToken) {
          try {
            // Use plain axios to avoid recursive interceptor calls
            const response = await axios.post(
              `${BASE_URL}/api/token/refresh/`,             // Django SimpleJWT refresh endpoint
              { refresh: refreshToken },
              { headers: { 'Content-Type': 'application/json' } }
            );
  
            const newAccessToken = response.data.access;
            localStorage.setItem('access_token', newAccessToken);  // Update token
  
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest); // Retry original request with new token
  
          } catch (err) {
            // Refresh token failed - logout or redirect to login page
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';  // or whatever your login route is
          }
        }
      }
      return Promise.reject(error);
    }
);

axiosInstance.interceptors.request.use(
  (config)=>{
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
)
  
export default axiosInstance;
  
