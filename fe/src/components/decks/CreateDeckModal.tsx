'use client';

import React, { useState, useEffect } from 'react';
import {
    Modal, Form, Input, Select, Switch, Button, ColorPicker,
    Divider, Space, Typography, message
} from 'antd';
import {
    PlusOutlined, FolderOutlined, LockOutlined,
    UnlockOutlined, GlobalOutlined, TagOutlined
} from '@ant-design/icons';
import type { Color } from 'antd/es/color-picker';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

// Định nghĩa kiểu dữ liệu cho Deck
interface DeckFormValues {
    name: string;
    description?: string;
    color: string;
    isPublic: boolean;
    languageId?: number;
    parentDeckId?: number | null;
}

// Props cho component
interface CreateDeckModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: DeckFormValues) => Promise<void>;
    parentDeckId?: number | null;
    loading?: boolean;
    availableLanguages?: { id: number; name: string }[];
    availableParentDecks?: { id: number; name: string; level: number }[];
}

// Màu sắc mặc định cho deck
const presetColors = [
    '#1890ff', // blue
    '#52c41a', // green
    '#fa8c16', // orange
    '#722ed1', // purple
    '#eb2f96', // pink
    '#faad14', // yellow
    '#a0d911', // lime
    '#13c2c2', // cyan
    '#f5222d', // red
];

const CreateDeckModal: React.FC<CreateDeckModalProps> = ({
                                                             visible,
                                                             onCancel,
                                                             onSubmit,
                                                             parentDeckId = null,
                                                             loading = false,
                                                             availableLanguages = [],
                                                             availableParentDecks = [],
                                                         }) => {
    const [form] = Form.useForm();
    const [formattedColorHex, setFormattedColorHex] = useState<string>('#1890ff');

    // Reset form khi modal mở
    useEffect(() => {
        if (visible) {
            form.resetFields();
            // Nếu có parentDeckId, đặt giá trị mặc định
            if (parentDeckId) {
                form.setFieldsValue({ parentDeckId });
            }
            // Đặt màu mặc định
            setFormattedColorHex('#1890ff');
            form.setFieldsValue({ color: '#1890ff', isPublic: false });
        }
    }, [visible, form, parentDeckId]);

    // Xử lý khi thay đổi màu
    const handleColorChange = (color: Color) => {
        const hexString = color.toHexString();
        setFormattedColorHex(hexString);
        form.setFieldsValue({ color: hexString });
    };

    // Xử lý khi submit form
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit(values);
            message.success('Deck created successfully!');
            onCancel();
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    // Mock data cho languages nếu không có data truyền vào
    const languages = availableLanguages.length > 0 ? availableLanguages : [
        { id: 1, name: 'English' },
        { id: 2, name: 'Spanish' },
        { id: 3, name: 'French' },
        { id: 4, name: 'German' },
        { id: 5, name: 'Japanese' },
    ];

    // Mock data cho parent decks nếu không có data truyền vào
    const parentDecks = availableParentDecks.length > 0 ? availableParentDecks : [
        { id: 1, name: 'English Vocabulary', level: 1 },
        { id: 2, name: 'Spanish Basics', level: 1 },
        { id: 3, name: 'Medical Terminology', level: 1 },
        { id: 6, name: 'Programming Terms', level: 1 },
    ];

    return (
        <Modal
            title={
                <Space>
                    <FolderOutlined style={{ color: formattedColorHex }} />
                    <span>Create New Deck</span>
                </Space>
            }
            open={visible}
            onCancel={onCancel}
            width={600}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    icon={<PlusOutlined />}
                >
                    Create Deck
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    isPublic: false,
                    color: '#1890ff',
                    parentDeckId: parentDeckId,
                }}
            >
                <Form.Item
                    name="name"
                    label="Deck Name"
                    rules={[
                        { required: true, message: 'Please enter a name for your deck' },
                        { min: 3, message: 'Name must be at least 3 characters' },
                        { max: 50, message: 'Name must be less than 50 characters' }
                    ]}
                >
                    <Input
                        placeholder="Enter a name for your deck"
                        prefix={<FolderOutlined style={{ color: formattedColorHex }} />}
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[
                        { max: 500, message: 'Description must be less than 500 characters' }
                    ]}
                >
                    <TextArea
                        placeholder="Enter a brief description of this deck"
                        rows={3}
                        showCount
                        maxLength={500}
                    />
                </Form.Item>

                <Form.Item
                    name="parentDeckId"
                    label="Parent Deck (Optional)"
                    help="Select a parent deck to create this as a sub-deck"
                >
                    <Select
                        placeholder="Select a parent deck (optional)"
                        allowClear
                        style={{ width: '100%' }}
                        optionFilterProp="children"
                    >
                        {parentDecks.map(deck => (
                            <Option key={deck.id} value={deck.id}>
                                {deck.name} {deck.level > 1 && '(Sub-deck)'}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Divider orientation="left">Appearance & Settings</Divider>

                <Form.Item
                    name="color"
                    label="Deck Color"
                >
                    <ColorPicker
                        format="hex"
                        value={formattedColorHex}
                        onChange={handleColorChange}
                        presets={[
                            {
                                label: 'Recommended',
                                colors: presetColors,
                            },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="languageId"
                    label="Language"
                >
                    <Select
                        placeholder="Select a language (optional)"
                        allowClear
                        style={{ width: '100%' }}
                        optionFilterProp="children"
                    >
                        {languages.map(language => (
                            <Option key={language.id} value={language.id}>
                                {language.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="isPublic"
                    label="Visibility"
                    valuePropName="checked"
                >
                    <Space direction="vertical">
                        <Switch
                            checkedChildren={<UnlockOutlined />}
                            unCheckedChildren={<LockOutlined />}
                        />
                        <Text type="secondary" style={{ marginTop: 4 }}>
                            {form.getFieldValue('isPublic') ? (
                                <Space>
                                    <GlobalOutlined /> This deck will be visible to other users
                                </Space>
                            ) : (
                                <Space>
                                    <LockOutlined /> This deck will be private to you only
                                </Space>
                            )}
                        </Text>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateDeckModal;
