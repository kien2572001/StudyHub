// src/api/types/common.ts
export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
    success: boolean;
}

export interface PaginatedResponse<T> {
    items: T[];
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ErrorResponse {
    message: string;
    errors?: Record<string, string[]>;
    status: number;
}

// src/api/types/requests.ts
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}
