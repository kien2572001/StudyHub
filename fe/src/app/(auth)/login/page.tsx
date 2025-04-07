'use client';

import {
    AlipayCircleOutlined,
    LockOutlined,
    MobileOutlined,
    TaobaoCircleOutlined,
    UserOutlined,
    WeiboCircleOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProConfigProvider,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText,
    setAlpha,
} from '@ant-design/pro-components';
import { Space, Tabs, message, theme } from 'antd';
import type { CSSProperties } from 'react';
import { useState } from 'react';

type LoginType = 'phone' | 'account';

export default () => {
    const { token } = theme.useToken();
    const [loginType, setLoginType] = useState<LoginType>('phone');

    const iconStyles: CSSProperties = {
        marginInlineStart: '16px',
        color: setAlpha(token.colorTextBase, 0.2),
        fontSize: '24px',
        verticalAlign: 'middle',
        cursor: 'pointer',
    };

    return (
        <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: token.colorBgContainer }}>
                <LoginForm
                    logo="https://github.githubassets.com/favicons/favicon.png"
                    title="Github"
                    subTitle="The world's largest code hosting platform"
                    // actions={
                    //     <Space>
                    //         Other login methods
                    //         <AlipayCircleOutlined style={iconStyles} />
                    //         <TaobaoCircleOutlined style={iconStyles} />
                    //         <WeiboCircleOutlined style={iconStyles} />
                    //     </Space>
                    // }
                >
                    <Tabs
                        centered
                        activeKey={loginType}
                        onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                    >
                        <Tabs.TabPane key={'account'} tab={'Login with Account'} />
                        <Tabs.TabPane key={'phone'} tab={'Login with Phone'} />
                    </Tabs>
                    {loginType === 'account' && (
                        <>
                            <ProFormText
                                name="username"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'Username: admin or user'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your username!',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                    strengthText:
                                        'Password should contain numbers, letters and special characters, at least 8 characters long.',
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
                                                    Strength: Medium
                                                </div>
                                            );
                                        }
                                        if (status === 'ok') {
                                            return (
                                                <div style={{ color: token.colorSuccess }}>
                                                    Strength: Strong
                                                </div>
                                            );
                                        }
                                        return (
                                            <div style={{ color: token.colorError }}>Strength: Weak</div>
                                        );
                                    },
                                }}
                                placeholder={'Password: ant.design'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your password!',
                                    },
                                ]}
                            />
                        </>
                    )}
                    {loginType === 'phone' && (
                        <>
                            <ProFormText
                                fieldProps={{
                                    size: 'large',
                                    prefix: <MobileOutlined className={'prefixIcon'} />,
                                }}
                                name="mobile"
                                placeholder={'Mobile phone'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your mobile phone!',
                                    },
                                    {
                                        pattern: /^1\d{10}$/,
                                        message: 'Mobile phone format is incorrect!',
                                    },
                                ]}
                            />
                            <ProFormCaptcha
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                }}
                                captchaProps={{
                                    size: 'large',
                                }}
                                placeholder={'Please enter verification code'}
                                captchaTextRender={(timing, count) => {
                                    if (timing) {
                                        return `${count} ${'Get verification code'}`;
                                    }
                                    return 'Get verification code';
                                }}
                                name="captcha"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter verification code!',
                                    },
                                ]}
                                onGetCaptcha={async () => {
                                    message.success('Verification code sent successfully! Code: 1234');
                                }}
                            />
                        </>
                    )}
                    <div
                        style={{
                            marginBlockEnd: 24,
                        }}
                    >
                        <ProFormCheckbox noStyle name="autoLogin">
                            Remember me
                        </ProFormCheckbox>
                        <a
                            style={{
                                float: 'right',
                            }}
                        >
                            Forgot password
                        </a>
                    </div>
                </LoginForm>
            </div>
        </ProConfigProvider>
    );
};
