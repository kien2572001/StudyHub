// src/api/axios/interceptors.ts
import { axiosInstance } from './instance';
import { getAccessToken, refreshToken } from '@/lib/auth';
import { message } from 'antd';
import { jwtDecode } from 'jwt-decode'; // Thêm import này

// Kiểm tra token hết hạn
const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode(token);
        return decoded.exp ? decoded.exp * 1000 < Date.now() : true;
    } catch (e) {
        return true;
    }
};

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = getAccessToken();
        if (token) {
            // Kiểm tra token hết hạn trước khi thêm vào header
            if (isTokenExpired(token)) {
                try {
                    // Tự động refresh token nếu đã hết hạn
                    const newToken = await refreshToken();
                    config.headers.Authorization = `Bearer ${newToken}`;
                } catch (error) {
                    // Nếu refresh token thất bại, chuyển hướng về trang login
                    window.location.href = '/auth/login?session=expired';
                    return Promise.reject(error);
                }
            } else {
                // Token còn hạn, sử dụng bình thường
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Token hết hạn (401) và chưa thử refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Refresh token
                const newToken = await refreshToken();

                // Cập nhật token trong request ban đầu và thử lại
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Xử lý lỗi refresh token (thường là đăng xuất)
                window.location.href = '/auth/login?session=expired';
                return Promise.reject(refreshError);
            }
        }

        // Xử lý các lỗi khác
        handleApiError(error);
        return Promise.reject(error);
    }
);

// Xử lý lỗi API
const handleApiError = (error) => {
    const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi';

    // Xử lý lỗi tùy theo status code
    switch (error.response?.status) {
        case 400:
            message.error(`Yêu cầu không hợp lệ: ${errorMessage}`);
            break;
        case 403:
            message.error('Bạn không có quyền thực hiện thao tác này');
            break;
        case 404:
            message.error('Không tìm thấy tài nguyên');
            break;
        case 500:
            message.error('Lỗi máy chủ. Vui lòng thử lại sau');
            break;
        default:
            message.error(errorMessage);
    }
};

export default axiosInstance;
