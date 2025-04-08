// src/api/axios/instance.ts
import axios, { AxiosRequestConfig } from 'axios';

const baseConfig: AxiosRequestConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
};

// Axios instance chính
export const axiosInstance = axios.create(baseConfig);

// Axios instance không có auth (cho login/register)
export const axiosPublic = axios.create(baseConfig);

export default axiosInstance;
