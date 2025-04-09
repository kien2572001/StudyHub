// src/config/routes.tsx

import React from 'react';
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

// Định nghĩa interface cho một route
export interface AppRoute {
    key: string;
    path: string;
    name: string;
    icon?: React.ReactNode;
    component?: React.ComponentType<any>;
    layout?: React.ComponentType<any>;
    isPublic?: boolean;
    hideInMenu?: boolean;
    exact?: boolean;
    routes?: AppRoute[];
    permissions?: string[];
}

// Map các icons dựa trên key
export const IconMap = {
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

// Tách các route thành các nhóm
export const LOGIN_ROUTE = '/auth/login';
export const REGISTER_ROUTE = '/auth/register';
export const DASHBOARD_ROUTE = '/';
export const PROFILE_ROUTE = '/profile';

// ========== ĐỊNH NGHĨA ROUTES THEO DOT NOTATION ==========

export const ROUTES = {
    // Auth routes
    AUTH: {
        BASE: '/auth',
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },

    // Dashboard
    DASHBOARD: '/',

    // Flashcard routes
    FLASH_CARDS: {
        BASE: '/flashcards',
        MY_DECKS: '/flashcards/my-decks',
        TEMPLATES: '/flashcards/templates',
        TAGS: '/flashcards/tags',
        SPACED_REPETITION: '/flashcards/spaced-repetition',
        STATISTICS: '/flashcards/statistics',
    },

    // Books routes
    BOOKS: {
        BASE: '/books',
        LIBRARY: '/books/library',
        READING_LIST: '/books/reading-list',
        BOOKMARKS: '/books/bookmarks',
        NOTES: '/books/notes',
        HIGHLIGHTS: '/books/highlights',
    },

    // Courses routes
    COURSES: {
        BASE: '/courses',
        MY_COURSES: '/courses/my-courses',
        AVAILABLE: '/courses/available',
    },

    // Assignments routes
    ASSIGNMENTS: {
        BASE: '/assignments',
        DUE: '/assignments/due',
        COMPLETED: '/assignments/completed',
    },

    // Community routes
    COMMUNITY: {
        BASE: '/community',
        GROUPS: '/community/groups',
        FORUMS: '/community/forums',
    },

    // Other routes
    PROFILE: '/profile',
    SETTINGS: '/settings',
    HELP: '/help',
    LOGOUT: '/logout',
};

// ========== ROUTE METADATA ==========

// Các route công khai (không yêu cầu đăng nhập)
export const PUBLIC_ROUTES: AppRoute[] = [
    {
        key: 'login',
        path: LOGIN_ROUTE,
        name: 'Login',
        isPublic: true,
        hideInMenu: true,
    },
    {
        key: 'register',
        path: REGISTER_ROUTE,
        name: 'Register',
        isPublic: true,
        hideInMenu: true,
    },
    {
        key: 'forgot-password',
        path: '/auth/forgot-password',
        name: 'Forgot Password',
        isPublic: true,
        hideInMenu: true,
    },
    {
        key: 'reset-password',
        path: '/auth/reset-password',
        name: 'Reset Password',
        isPublic: true,
        hideInMenu: true,
    },
    // {
    //     key: 'home',
    //     path: '/',
    //     name: 'Home',
    //     isPublic: true,
    //     hideInMenu: true,
    // },
];

// Các route yêu cầu xác thực (chỉ hiển thị trong dashboard sau khi đăng nhập)
export const AUTHENTICATED_ROUTES: AppRoute[] = [
    {
        key: 'dashboard',
        path: DASHBOARD_ROUTE,
        name: 'Dashboard',
        icon: 'dashboard',
    },
    {
        key: 'flashcards',
        path: '/flashcards',
        name: 'Flash Cards',
        icon: 'credit-card',
        routes: [
            {
                key: 'my-decks',
                path: '/flashcards/my-decks',
                name: 'My Decks',
            },
            {
                key: 'templates',
                path: '/flashcards/templates',
                name: 'My Card Templates',
            },
            {
                key: 'tags',
                path: '/flashcards/tags',
                name: 'My Tags',
            },
            {
                key: 'spaced-repetition',
                path: '/flashcards/spaced-repetition',
                name: 'Spaced Repetition',
            },
            {
                key: 'statistics',
                path: '/flashcards/statistics',
                name: 'Statistics',
            },
        ],
    },
    {
        key: 'books',
        path: '/books',
        name: 'Books',
        icon: 'book',
        routes: [
            {
                key: 'library',
                path: '/books/library',
                name: 'My Library',
            },
            {
                key: 'reading-list',
                path: '/books/reading-list',
                name: 'Reading List',
            },
            {
                key: 'bookmarks',
                path: '/books/bookmarks',
                name: 'Bookmarks',
            },
            {
                key: 'notes',
                path: '/books/notes',
                name: 'Notes',
            },
            {
                key: 'highlights',
                path: '/books/highlights',
                name: 'Highlights',
            },
        ],
    },
    {
        key: 'courses',
        path: '/courses',
        name: 'Courses',
        icon: 'read',
        routes: [
            {
                key: 'my-courses',
                path: '/courses/my-courses',
                name: 'My Courses',
            },
            {
                key: 'available',
                path: '/courses/available',
                name: 'Available Courses',
            },
        ],
    },
    {
        key: 'assignments',
        path: '/assignments',
        name: 'Assignments',
        icon: 'form',
        routes: [
            {
                key: 'due',
                path: '/assignments/due',
                name: 'Due Assignments',
            },
            {
                key: 'completed',
                path: '/assignments/completed',
                name: 'Completed',
            },
        ],
    },
    {
        key: 'community',
        path: '/community',
        name: 'Community',
        icon: 'team',
        routes: [
            {
                key: 'groups',
                path: '/community/groups',
                name: 'Study Groups',
            },
            {
                key: 'forums',
                path: '/community/forums',
                name: 'Discussion Forums',
            },
        ],
    },
    {
        key: 'profile',
        path: PROFILE_ROUTE,
        name: 'Profile',
        icon: 'user',
    },
    {
        key: 'settings',
        path: '/settings',
        name: 'Settings',
        icon: 'setting',
    },
    {
        key: 'help',
        path: '/help',
        name: 'Help',
        icon: 'question-circle',
    },
    {
        key: 'logout',
        path: '/logout',
        name: 'Logout',
        icon: 'logout',
        // Không phải route thật, chỉ dùng cho action logout
    },
];

// Kết hợp tất cả route
export const ALL_ROUTES: AppRoute[] = [...PUBLIC_ROUTES, ...AUTHENTICATED_ROUTES];

// Các helper functions
export const getRouteByPath = (path: string): AppRoute | undefined => {
    // Hàm tìm route theo path, bao gồm cả nested routes
    const findRoute = (routes: AppRoute[]): AppRoute | undefined => {
        for (const route of routes) {
            if (route.path === path) return route;
            if (route.routes) {
                const found = findRoute(route.routes);
                if (found) return found;
            }
        }
        return undefined;
    };

    return findRoute(ALL_ROUTES);
};

export const isPublicRoute = (path: string): boolean => {
    const route = getRouteByPath(path);
    return !!route?.isPublic;
};

// @ts-ignore
export const getMenuDataFromRoutes = (routes: AppRoute[]) => {
    return routes
        .filter(route => !route.hideInMenu)
        // @ts-ignore
        .map(({ icon, routes: children, ...item }) => ({
            ...item,
            icon: icon || (typeof icon === 'string' ? IconMap[icon as keyof typeof IconMap] : null),
            children: children ? getMenuDataFromRoutes(children) : undefined,
        }));
};
