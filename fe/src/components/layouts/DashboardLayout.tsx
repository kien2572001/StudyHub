'use client';

import type { MenuDataItem } from '@ant-design/pro-components';
import { PageContainer, ProLayout } from '@ant-design/pro-components';
import { Button, ConfigProvider, Dropdown, Space } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import React, { useEffect, useState } from 'react';
import {
    BookOutlined,
    CreditCardOutlined,
    DashboardOutlined,
    FormOutlined,
    LogoutOutlined,
    QuestionCircleOutlined,
    ReadOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';

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

    useEffect(() => {
        setMounted(true);
    }, []);

    // Xử lý sự kiện logout
    const handleLogout = () => {
        // Thêm logic logout ở đây (ví dụ: xóa token, chuyển hướng đến trang login)
        console.log('User logged out');
        // window.location.href = '/login';
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
                menu={{ request: async () => loopMenuItem(defaultMenus) }}
                onMenuHeaderClick={() => window.location.href = '/'}
                menuItemRender={(item, dom) => (
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            if (item.path === '/logout') {
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
                    <Button
                        type="primary"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                )}
            >
                <PageContainer content="Welcome to StudyHub">
                    {children}
                </PageContainer>
            </ProLayout>
        </ConfigProvider>
    );
}
