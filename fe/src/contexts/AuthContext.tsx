// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    getAccessToken,
    getUserInfo,
    saveAuthData,
    clearAuthData,
    isAuthenticated as checkAuth
} from '@/lib/auth';
import type { UserEntity } from "@/types/user.entity";
import {
    LOGIN_ROUTE,
    DASHBOARD_ROUTE,
    isPublicRoute,
    PUBLIC_ROUTES,
    ROUTES
} from '@/config/routes';

// Định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
    isAuthenticated: boolean;
    user: UserEntity | null;
    loading: boolean;
    login: (authData: { accessToken: string; user: UserEntity }) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<UserEntity | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [mounted, setMounted] = useState(false);

    // Đánh dấu component đã mount
    useEffect(() => {
        setMounted(true);
    }, []);

    // Kiểm tra trạng thái xác thực khi component mount
    useEffect(() => {
        const checkAuthStatus = () => {
            const isLoggedIn = checkAuth();
            const userData = getUserInfo();

            setIsAuthenticated(isLoggedIn);
            setUser(userData);
            setLoading(false);
        };

        checkAuthStatus();
    }, []);

    // Xử lý chuyển hướng dựa trên auth status và route hiện tại
    useEffect(() => {
        // Đảm bảo code này chỉ chạy ở client-side và sau khi component đã mount
        if (typeof window === 'undefined' || loading || !mounted) return;

        const pathname = window.location.pathname;

        // Nếu đã đăng nhập và đang ở trang login => redirect sang dashboard
        if (isAuthenticated && pathname === ROUTES.AUTH.LOGIN) {
            window.location.href = ROUTES.DASHBOARD;
            return;
        }

        // Nếu chưa đăng nhập và đang ở trang được bảo vệ (không phải public route)
        if (!isAuthenticated && !isPublicRoute(pathname)) {
            // Lưu đường dẫn hiện tại để redirect sau khi đăng nhập
            const returnUrl = encodeURIComponent(pathname + window.location.search);
            window.location.href = `${ROUTES.AUTH.LOGIN}?returnUrl=${returnUrl}`;
        }
    }, [isAuthenticated, loading, mounted]);

    // Hàm xử lý đăng nhập
    const login = async (authData: { accessToken: string; user: UserEntity }) => {
        saveAuthData(authData);
        setIsAuthenticated(true);
        setUser(authData.user);

        // Sử dụng window.location thay vì router
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const returnUrl = params.get('returnUrl');

            if (returnUrl) {
                window.location.href = decodeURIComponent(returnUrl);
            } else {
                window.location.href = ROUTES.DASHBOARD;
            }
        }
    };

    // Hàm xử lý đăng xuất
    const logout = () => {
        clearAuthData();
        setIsAuthenticated(false);
        setUser(null);

        // Sử dụng window.location thay vì router
        if (typeof window !== 'undefined') {
            window.location.href = ROUTES.AUTH.LOGIN;
        }
    };

    // Giá trị được chia sẻ qua context
    const contextValue: AuthContextType = {
        isAuthenticated,
        user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {loading ? (
                // Hiển thị loading spinner/screen trong khi kiểm tra xác thực
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="ml-2">Đang xác thực người dùng...</p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
