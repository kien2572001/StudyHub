// import { axiosInstance } from '../axios';
// import type { ApiResponse, PaginatedResponse } from '@/types/common';
// import type { User } from '@/types/user';
//
// export const UserService = {
//     async getUsers(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<User>>> {
//         const response = await axiosInstance.get<ApiResponse<PaginatedResponse<User>>>('/users', {
//             params: { page, limit }
//         });
//         return response.data;
//     },
//
//     async getUserById(id: string): Promise<ApiResponse<User>> {
//         const response = await axiosInstance.get<ApiResponse<User>>(`/users/${id}`);
//         return response.data;
//     },
//
//     async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
//         const response = await axiosInstance.put<ApiResponse<User>>(`/users/${id}`, userData);
//         return response.data;
//     },
//
//     async deleteUser(id: string): Promise<ApiResponse<null>> {
//         const response = await axiosInstance.delete<ApiResponse<null>>(`/users/${id}`);
//         return response.data;
//     },
// };
