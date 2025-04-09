// src/components/guards/GuestGuard.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {ROUTES} from "@/config/routes";

interface GuestGuardProps {
    children: ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
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

        // Chỉ thực hiện chuyển hướng khi đã xác thực và không còn loading
        if (!loading && isAuthenticated) {
            // Sử dụng dynamic import để tránh lỗi SSR
            const handleNavigation = async () => {
                try {
                    // Sử dụng import động để Next.js không xử lý nó trong quá trình SSR
                    const router = (await import('next/router')).default;
                    router.replace(ROUTES.DASHBOARD); // Chuyển hướng đến trang dashboard
                } catch (error) {
                    // Fallback nếu import động thất bại
                    console.error('Router navigation failed:', error);
                    window.location.href = ROUTES.DASHBOARD; // Chuyển hướng đến trang dashboard
                }
            };

            handleNavigation();
        }
    }, [isAuthenticated, loading, mounted]);

    // Không render gì trong quá trình SSR hoặc trước khi hydration hoàn tất
    if (!mounted) return null;

    // Hiển thị loading hoặc không hiển thị gì nếu đã xác thực
    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (isAuthenticated) {
        return <div className="redirecting">Đang chuyển hướng...</div>;
    }

    // Chỉ hiển thị children nếu chưa xác thực và không còn loading
    return <>{children}</>;
};
