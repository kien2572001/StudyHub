// src/components/guards/AuthGuard.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {ROUTES} from "@/config/routes";

interface AuthGuardProps {
    children: ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const [mounted, setMounted] = useState(false);

    // Đánh dấu component đã được mount ở client-side
    useEffect(() => {
        setMounted(true);
    }, []);

    // Xử lý chuyển hướng sau khi component đã mount
    useEffect(() => {
        // Chỉ thực hiện sau khi component đã mount ở client-side
        if (!mounted) return;

        // Chỉ thực hiện chuyển hướng khi đã kiểm tra xong auth và chưa xác thực
        if (!loading && !isAuthenticated) {
            // Sử dụng dynamic import để tránh lỗi SSR
            const handleNavigation = async () => {
                try {
                    // Sử dụng import động để Next.js không xử lý nó trong quá trình SSR
                    const router = (await import('next/router')).default;
                    // Lưu URL hiện tại để redirect sau khi đăng nhập
                    const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
                    //router.replace(`/login?returnUrl=${returnUrl}`);
                    router.replace(ROUTES.AUTH.LOGIN + `?returnUrl=${returnUrl}`);
                } catch (error) {
                    // Fallback nếu import động thất bại
                    console.error('Router navigation failed:', error);
                    //window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
                    window.location.href = ROUTES.AUTH.LOGIN + `?returnUrl=${encodeURIComponent(window.location.pathname)}`;
                }
            };

            handleNavigation();
        }
    }, [isAuthenticated, loading, mounted]);

    // Không render gì trong quá trình SSR hoặc trước khi hydration hoàn tất
    if (!mounted) return null;

    // Hiển thị loading hoặc không hiển thị gì nếu chưa xác thực
    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (!isAuthenticated) {
        return <div className="redirecting">Đang chuyển hướng đến trang đăng nhập...</div>;
    }

    // Chỉ hiển thị children nếu đã xác thực và không còn loading
    return <>{children}</>;
};
