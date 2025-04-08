// src/api/services/auth.service.ts
import { axiosPublic, axiosInstance } from '../axios';
import type { LoginRequest, RegisterRequest } from '@/types/common';
import type { ApiResponse } from '@/types/common';
import type { UserEntity, AuthTokens } from '@/types/user.entity';

export const AuthService = {
    async login(data: LoginRequest): Promise<ApiResponse<AuthTokens>> {
        const response = await axiosPublic.post<ApiResponse<AuthTokens>>('/auth/login', data);
        return response.data;
    },

    // async register(data: RegisterRequest): Promise<ApiResponse<User>> {
    //     const response = await axiosPublic.post<ApiResponse<User>>('/auth/register', data);
    //     return response.data;
    // },

    async logout(): Promise<ApiResponse<null>> {
        const response = await axiosInstance.post<ApiResponse<null>>('/auth/logout');
        return response.data;
    },

    // async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    //     const response = await axiosPublic.post<ApiResponse<AuthTokens>>('/auth/refresh', { refreshToken });
    //     return response.data;
    // },
};
