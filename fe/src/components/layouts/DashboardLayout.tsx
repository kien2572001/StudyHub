'use client';

import type { MenuDataItem } from '@ant-design/pro-components';
import { PageContainer, ProLayout } from '@ant-design/pro-components';
import { Button, ConfigProvider, Dropdown, Space, message } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import React, { useEffect, useState } from 'react';
import {
    BookOutlined,
    CreditCardOutlined,
    DashboardOutlined,
    DownOutlined,
    FormOutlined,
    LogoutOutlined,
    QuestionCircleOutlined,
    ReadOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext'; // Thêm dòng này để import useAuth
import { AUTHENTICATED_ROUTES, getMenuDataFromRoutes, ROUTES } from '@/config/routes';

const IconMap = {
    'dashboard': <DashboardOutlined />,
    'credit-card': <CreditCardOutlined />,
    'book': <BookOutlined />,
    'read': <ReadOutlined />,
    'form': <FormOutlined />,
    'team': <TeamOutlined />,
    'user': <UserOutlined />,
    'setting': <SettingOutlined />,
    'question-circle': <QuestionCircleOutlined />,
    'logout': <LogoutOutlined />,
};


const defaultMenus = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        icon: 'dashboard',
    },
    {
        path: '/flashcards',
        name: 'Flash Cards',
        icon: 'credit-card',
        routes: [
            {
                path: '/flashcards/my-decks',
                name: 'My Decks',
            },
            {
                path: '/flashcards/templates',
                name: 'My Card Templates',
            },
            {
                path: '/flashcards/tags',
                name: 'My Tags',
            },
            {
                path: '/flashcards/spaced-repetition',
                name: 'Spaced Repetition',
            },
            {
                path: '/flashcards/statistics',
                name: 'Statistics',
            },
        ],
    },
    {
        path: '/books',
        name: 'Books',
        icon: 'book',
        routes: [
            {
                path: '/books/library',
                name: 'My Library',
            },
            {
                path: '/books/reading-list',
                name: 'Reading List',
            },
            {
                path: '/books/bookmarks',
                name: 'Bookmarks',
            },
            {
                path: '/books/notes',
                name: 'Notes',
            },
            {
                path: '/books/highlights',
                name: 'Highlights',
            },
        ],
    },
    {
        path: '/courses',
        name: 'Courses',
        icon: 'read',
        routes: [
            {
                path: '/courses/my-courses',
                name: 'My Courses',
            },
            {
                path: '/courses/available',
                name: 'Available Courses',
            },
        ],
    },
    {
        path: '/assignments',
        name: 'Assignments',
        icon: 'form',
        routes: [
            {
                path: '/assignments/due',
                name: 'Due Assignments',
            },
            {
                path: '/assignments/completed',
                name: 'Completed',
            },
        ],
    },
    {
        path: '/community',
        name: 'Community',
        icon: 'team',
        routes: [
            {
                path: '/community/groups',
                name: 'Study Groups',
            },
            {
                path: '/community/forums',
                name: 'Discussion Forums',
            },
        ],
    },
    {
        path: '/profile',
        name: 'Profile',
        icon: 'user',
    },
    {
        path: '/settings',
        name: 'Settings',
        icon: 'setting',
    },
    {
        path: '/help',
        name: 'Help',
        icon: 'question-circle',
    },
    {
        path: '/logout',
        name: 'Logout',
        icon: 'logout',
    },
];

const loopMenuItem = (menus: any[]): MenuDataItem[] =>
    menus.map(({ icon, routes, ...item }) => ({
        ...item,
        // @ts-ignore
        icon: icon && IconMap[icon],
        children: routes && loopMenuItem(routes),
    }));

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    // Client-side only rendering for the layout
    const [mounted, setMounted] = useState(false);
    const { logout: authLogout, user } = useAuth(); // Lấy hàm logout và thông tin user từ AuthContext
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Xử lý sự kiện logout
    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            message.loading({ content: 'Đang đăng xuất...', key: 'logout' });

            // Gọi hàm logout từ AuthContext
            await authLogout();

            // Hiển thị thông báo thành công
            message.success({ content: 'Đã đăng xuất thành công!', key: 'logout', duration: 2 });

            // Chuyển hướng đến trang đăng nhập
            setTimeout(() => {
                window.location.href = ROUTES.AUTH.LOGIN;
            }, 1000);
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
            message.error({ content: 'Đăng xuất thất bại, vui lòng thử lại!', key: 'logout' });
        } finally {
            setLoggingOut(false);
        }
    };

    // Return null on first render to avoid hydration mismatch
    if (!mounted) {
        return null;
    }

    return (
        <ConfigProvider locale={enUS}>
            <ProLayout
                style={{
                    minHeight: 500,
                }}
                fixSiderbar
                location={{
                    pathname: '/welcome/welcome',
                }}
                menu={{ request: async () => loopMenuItem(AUTHENTICATED_ROUTES) }}
                onMenuHeaderClick={() => window.location.href = ROUTES.DASHBOARD}
                menuItemRender={(item, dom) => (
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            if (item.path === ROUTES.LOGOUT) {
                                handleLogout();
                            } else if (item.path) {
                                window.location.href = item.path;
                            }
                        }}
                    >
                        {dom}
                    </a>
                )}
                actionsRender={() => (
                    <Space size="middle" style={{ marginRight: 24 }}>
                        <Button
                            type="primary"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            loading={loggingOut}
                        >
                            Logout
                        </Button>
                    </Space>
                )}
            >
                <PageContainer content="Welcome to StudyHub">
                    {children}
                </PageContainer>
            </ProLayout>
        </ConfigProvider>
    );
}
