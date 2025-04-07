export const ApiRoutes = {
    // API version prefix
    API_PREFIX: '/api/v1',

    // Auth routes
    AUTH: {
        ROOT: '/auth',
        REGISTER: '/register',
        LOGIN: '/login',
        LOGOUT: '/logout',
        REFRESH_TOKEN: '/refresh-token',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password',
        CHANGE_PASSWORD: '/change-password',
        ME: '/me',
    },

    // User routes
    USER: {
        ROOT: '/users',
        BY_ID: '/:id',
        PROFILE: '/:id/profile',
        POSTS: '/:id/posts',
        COMMENTS: '/:id/comments',
        TOGGLE_ACTIVE: '/:id/toggle-active',
        UPDATE_ROLE: '/:id/role',
    },

    // Post routes
    POST: {
        ROOT: '/posts',
        BY_ID: '/:id',
        COMMENTS: '/:id/comments',
        TOGGLE_PUBLISH: '/:id/toggle-publish',
        BY_TAG: '/tags/:tagId',
        SEARCH: '/search',
    },

    // Comment routes
    COMMENT: {
        ROOT: '/comments',
        BY_ID: '/:id',
        BY_USER: '/user/:userId',
    },

    // Tag routes
    TAG: {
        ROOT: '/tags',
        BY_ID: '/:id',
        POPULAR: '/popular',
    },

    // Health check
    HEALTH: '/health',
} as const;
