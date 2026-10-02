import axios from 'axios';

export const apiClient = axios.create({
    baseURL: '/api/backend/api/v1',
    headers: {
        'Content-Type': 'application/json',
        // ❌ X-API-Key тут больше не нужен — прокси добавит его сам
    },
});

apiClient.interceptors.response.use(
    (res) => res,
    (error) => {
        if (process.env.NODE_ENV !== 'production') {
            console.error('[API Error]', error.response?.data ?? error.message);
        }
        return Promise.reject(error);
    },
);