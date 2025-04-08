import * as yup from 'yup';

// Register validation schema
export const registerSchema = yup.object({
    name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required').min(8, 'Password must be at least 8 characters').max(50, 'Password must not exceed 50 characters'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required')
});

// Login validation schema
export const loginSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required')
});

// Refresh token schema
export const refreshTokenSchema = yup.object({
    refreshToken: yup.string()
});

// Change password schema
export const changePasswordSchema = yup.object({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup.string().required('New password is required').min(8, 'Password must be at least 8 characters').max(50, 'Password must not exceed 50 characters'),
    confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match').required('Confirm password is required')
});
