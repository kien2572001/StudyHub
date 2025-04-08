// src/lib/auth.ts
import { axiosPublic } from '@/api/axios';
import type { UserEntity} from "@/types/user.entity";

// Xác định interface cho dữ liệu trả về từ API login
interface AuthResponse {
    accessToken: string;
    user: UserEntity;
}

// Lưu trữ access token
export const saveAccessToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', token);
    }
};

// Lưu thông tin user
export const saveUserInfo = (user: UserEntity): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
    }
};

// Lưu thông tin auth từ response login
export const saveAuthData = (authData: AuthResponse): void => {
    saveAccessToken(authData.accessToken);
    saveUserInfo(authData.user);
};

// Lấy access token từ localStorage
export const getAccessToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken');
    }
    return null;
};

// Lấy thông tin user
export const getUserInfo = (): UserEntity | null => {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (e) {
                return null;
            }
        }
    }
    return null;
};

// Xóa thông tin đăng nhập
export const clearAuthData = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
    }
};

// Refresh token (không cần gửi refreshToken vì nó đã trong cookie)
export const refreshToken = async (): Promise<string> => {
    try {
        // Gọi API refresh token - Browser sẽ tự gửi cookie đi
        const response = await axiosPublic.post('/auth/refresh');

        // Lưu access token mới
        const newAccessToken = response.data.data.accessToken;
        saveAccessToken(newAccessToken);

        return newAccessToken;
    } catch (error) {
        // Nếu refresh thất bại, xóa dữ liệu auth và ném lỗi
        clearAuthData();
        throw error;
    }
};

// Kiểm tra người dùng đã đăng nhập chưa
export const isAuthenticated = (): boolean => {
    return !!getAccessToken();
};
