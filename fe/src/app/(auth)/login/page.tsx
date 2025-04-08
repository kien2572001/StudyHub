'use client';

import {
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProConfigProvider,
    ProFormCheckbox,
    ProFormText,
    setAlpha,
} from '@ant-design/pro-components';
import { message, theme } from 'antd';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/api/services/auth.service';
import { saveAuthData } from '@/lib/auth';
import type { LoginRequest } from '@/types/common';

export default () => {
    const router = useRouter();
    const { token } = theme.useToken();
    const [loading, setLoading] = useState<boolean>(false);

    const iconStyles: CSSProperties = {
        marginInlineStart: '16px',
        color: setAlpha(token.colorTextBase, 0.2),
        fontSize: '24px',
        verticalAlign: 'middle',
        cursor: 'pointer',
    };

    // Xử lý submit form
    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);

            // Cấu trúc dữ liệu đăng nhập
            const loginData: LoginRequest = {
                email: values.username,
                password: values.password
            };

            // Sử dụng AuthService.login thay vì gọi API trực tiếp
            const response = await AuthService.login(loginData);

            // Lưu thông tin đăng nhập
            saveAuthData(response.data);

            message.success(response.message || 'Đăng nhập thành công!');

            // Chuyển hướng sau khi đăng nhập thành công
            router.push('/dashboard');
        } catch (error: any) {
            // Xử lý lỗi đăng nhập
            const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý logout
    const handleLogout = async () => {
        try {
            await AuthService.logout();
            // Xóa dữ liệu đăng nhập trong localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
            }
            message.success('Đăng xuất thành công!');
            router.push('/auth/login');
        } catch (error) {
            message.error('Đăng xuất thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: token.colorBgContainer }}>
                <LoginForm
                    logo="https://github.githubassets.com/favicons/favicon.png"
                    title="Github"
                    subTitle="The world's largest code hosting platform"
                    onFinish={handleSubmit}
                    submitter={{
                        searchConfig: {
                            submitText: 'Đăng nhập',
                        },
                        submitButtonProps: {
                            loading: loading,
                            size: 'large',
                            style: {
                                width: '100%',
                            },
                        },
                        render: (_, dom) => dom.pop(),
                    }}
                >
                    <ProFormText
                        name="username"
                        fieldProps={{
                            size: 'large',
                            prefix: <UserOutlined className={'prefixIcon'} />,
                        }}
                        placeholder={'Email address'}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập email!',
                            },
                            {
                                type: 'email',
                                message: 'Vui lòng nhập đúng định dạng email!',
                            },
                        ]}
                    />
                    <ProFormText.Password
                        name="password"
                        fieldProps={{
                            size: 'large',
                            prefix: <LockOutlined className={'prefixIcon'} />,
                            strengthText:
                                'Mật khẩu nên chứa chữ số, chữ cái và ký tự đặc biệt, ít nhất 8 ký tự.',
                            statusRender: (value) => {
                                const getStatus = () => {
                                    if (value && value.length > 12) {
                                        return 'ok';
                                    }
                                    if (value && value.length > 6) {
                                        return 'pass';
                                    }
                                    return 'poor';
                                };
                                const status = getStatus();
                                if (status === 'pass') {
                                    return (
                                        <div style={{ color: token.colorWarning }}>
                                            Độ mạnh: Trung bình
                                        </div>
                                    );
                                }
                                if (status === 'ok') {
                                    return (
                                        <div style={{ color: token.colorSuccess }}>
                                            Độ mạnh: Cao
                                        </div>
                                    );
                                }
                                return (
                                    <div style={{ color: token.colorError }}>Độ mạnh: Yếu</div>
                                );
                            },
                        }}
                        placeholder={'Password'}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu!',
                            },
                        ]}
                    />
                    <div
                        style={{
                            marginBlockEnd: 24,
                        }}
                    >
                        <ProFormCheckbox noStyle name="autoLogin">
                            Ghi nhớ đăng nhập
                        </ProFormCheckbox>
                        <a
                            style={{
                                float: 'right',
                            }}
                            onClick={() => router.push('/auth/forgot-password')}
                        >
                            Quên mật khẩu
                        </a>
                    </div>
                </LoginForm>
                <div style={{ textAlign: 'center', margin: '16px 0' }}>
                    <span>Chưa có tài khoản? </span>
                    <a onClick={() => router.push('/auth/register')}>Đăng ký ngay</a>
                </div>
            </div>
        </ProConfigProvider>
    );
};
