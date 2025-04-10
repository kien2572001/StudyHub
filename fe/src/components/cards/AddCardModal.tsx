// @/components/cards/AddCardModal.tsx

import React, { useState, useEffect } from 'react';
import {
    Modal, Form, Select, Button, Tabs, Upload, Divider, Space, Typography
} from 'antd';
import { PlusOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import type { RcFile } from 'antd/es/upload';
import { Editor } from '@tinymce/tinymce-react';
import styles from './AddCardModal.module.css';

const { Text } = Typography;

interface AddCardModalProps {
    visible: boolean;
    deckId: number | null;
    deckName: string;
    onCancel: () => void;
    onSubmit: (values: any) => Promise<void>;
    loading: boolean;
}

const AddCardModal: React.FC<AddCardModalProps> = ({
                                                       visible,
                                                       deckId,
                                                       deckName,
                                                       onCancel,
                                                       onSubmit,
                                                       loading
                                                   }) => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // State để lưu giá trị từ TinyMCE
    const [frontContent, setFrontContent] = useState('');
    const [backContent, setBackContent] = useState('');
    const [exampleContent, setExampleContent] = useState('');
    const [notesContent, setNotesContent] = useState('');

    useEffect(() => {
        if (visible) {
            form.resetFields();
            setImageUrl(null);
            setFrontContent('');
            setBackContent('');
            setExampleContent('');
            setNotesContent('');
        }
    }, [visible, form]);

    const handleUpload = (file: RcFile) => {
        setUploading(true);
        setTimeout(() => {
            setImageUrl(URL.createObjectURL(file));
            setUploading(false);
        }, 1000);
        return false;
    };

    const uploadButton = (
        <div>
            {uploading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    // Hàm xử lý khi submit form
    const handleFormSubmit = (values: any) => {
        // Gộp giá trị từ TinyMCE vào values
        const updatedValues = {
            ...values,
            front: frontContent,
            back: backContent,
            example: exampleContent,
            notes: notesContent,
            image: imageUrl
        };

        onSubmit(updatedValues);
    };

    // Cấu hình TinyMCE cơ bản cho mặt trước (đơn giản)
    const frontEditorConfig = {
        height: 150,
        menubar: false,
        plugins: [
            'autolink', 'lists', 'paste'
        ],
        toolbar: 'bold italic | undo redo',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
        placeholder: 'Enter the term or question',
        branding: false,
        resize: false
    };

    // Cấu hình TinyMCE đầy đủ cho mặt sau
    const backEditorConfig = {
        height: 300,
        menubar: false,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'anchor', 'searchreplace', 'visualblocks', 'code',
            'insertdatetime', 'media', 'table', 'help', 'wordcount',
            'paste', 'textcolor', 'emoticons'
        ],
        toolbar: 'undo redo | blocks | ' +
            'bold italic underline strikethrough | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'forecolor backcolor | link table image | removeformat help',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
        placeholder: 'Enter the definition, answer or explanation',
        branding: false,
        resize: true,
        paste_data_images: true,
        image_advtab: true,
        automatic_uploads: true
    };

    // Cấu hình TinyMCE cho examples và notes (trung bình)
    const simpleEditorConfig = {
        height: 200,
        menubar: false,
        plugins: [
            'autolink', 'lists', 'link', 'paste'
        ],
        toolbar: 'bold italic | bullist numlist | link | undo redo',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
        branding: false,
        resize: true
    };

    return (
        <Modal
            title={`Add Card to "${deckName}"`}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            destroyOnClose={true}
            style={{ top: 20 }}
            bodyStyle={{ padding: '24px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
                initialValues={{ image: null }}
            >
                <Tabs defaultActiveKey="basic">
                    <Tabs.TabPane tab="Basic Info" key="basic">
                        <Form.Item
                            name="front"
                            label={<Text strong>Front Side</Text>}
                            rules={[{ required: true, message: 'Please enter content for front side' }]}
                        >
                            <div className={`${styles.editorContainer} ${styles.frontEditor}`}>
                                <Editor
                                    apiKey='huk8rglwx002936sehcidvwi0nymctkdk8g8vx63xla8odr0'
                                    //tinymceScriptSrc="/tinymce/tinymce.min.js" // Đường dẫn đến TinyMCE script
                                    onInit={(evt, editor) => {
                                        // editor initialized
                                    }}
                                    initialValue=""
                                    value={frontContent}
                                    onEditorChange={(content) => {
                                        setFrontContent(content);
                                    }}
                                    init={frontEditorConfig}
                                />
                            </div>
                            <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                                Keep it concise - this is what you'll need to recall
                            </Text>
                        </Form.Item>

                        <Form.Item
                            name="back"
                            label={<Text strong>Back Side</Text>}
                            rules={[{ required: true, message: 'Please enter content for back side' }]}
                        >
                            <div className={`${styles.editorContainer} ${styles.backEditor}`}>
                                <Editor
                                    apiKey='huk8rglwx002936sehcidvwi0nymctkdk8g8vx63xla8odr0'
                                    //tinymceScriptSrc="/tinymce/tinymce.min.js"
                                    initialValue=""
                                    value={backContent}
                                    onEditorChange={(content) => {
                                        setBackContent(content);
                                    }}
                                    init={backEditorConfig}
                                />
                            </div>
                            <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                                You can drag the bottom-right corner to resize this editor
                            </Text>
                        </Form.Item>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="Media & Examples" key="media">
                        <Form.Item name="image" label={<Text strong>Image (Optional)</Text>}>
                            <Upload
                                name="image"
                                listType="picture-card"
                                showUploadList={false}
                                beforeUpload={handleUpload}
                                maxCount={1}
                            >
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="Card"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                            {imageUrl && (
                                <Button
                                    type="text"
                                    danger
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setImageUrl(null);
                                    }}
                                    icon={<DeleteOutlined />}
                                >
                                    Remove Image
                                </Button>
                            )}
                        </Form.Item>

                        <Form.Item name="example" label={<Text strong>Example (Optional)</Text>}>
                            <div className={`${styles.editorContainer} ${styles.exampleEditor}`}>
                                <Editor
                                    apiKey='huk8rglwx002936sehcidvwi0nymctkdk8g8vx63xla8odr0'
                                    //tinymceScriptSrc="/tinymce/tinymce.min.js"
                                    initialValue=""
                                    value={exampleContent}
                                    onEditorChange={(content) => {
                                        setExampleContent(content);
                                    }}
                                    init={{
                                        ...simpleEditorConfig,
                                        placeholder: 'Add an example to help with context'
                                    }}
                                />
                            </div>
                            <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                                Examples help reinforce learning and provide real-world context
                            </Text>
                        </Form.Item>
                    </Tabs.TabPane>

                    <Tabs.TabPane tab="Advanced" key="advanced">
                        <Form.Item name="tags" label={<Text strong>Tags</Text>}>
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                placeholder="Add tags to organize your cards"
                                options={[
                                    { value: 'important', label: 'Important' },
                                    { value: 'difficult', label: 'Difficult' },
                                    { value: 'grammar', label: 'Grammar' },
                                    { value: 'vocabulary', label: 'Vocabulary' },
                                ]}
                            />
                        </Form.Item>

                        <Form.Item name="notes" label={<Text strong>Personal Notes</Text>} extra="Not shown during review">
                            <div className={`${styles.editorContainer} ${styles.notesEditor}`}>
                                <Editor
                                    apiKey='huk8rglwx002936sehcidvwi0nymctkdk8g8vx63xla8odr0'
                                    //tinymceScriptSrc="/tinymce/tinymce.min.js"
                                    initialValue=""
                                    value={notesContent}
                                    onEditorChange={(content) => {
                                        setNotesContent(content);
                                    }}
                                    init={{
                                        ...simpleEditorConfig,
                                        placeholder: 'Add any personal notes about this card'
                                    }}
                                />
                            </div>
                        </Form.Item>
                    </Tabs.TabPane>
                </Tabs>

                <Divider />

                <Form.Item>
                    <Space>
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Add Card
                        </Button>
                        <Button type="default" htmlType="submit" loading={loading}>
                            Add Card & Create Another
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddCardModal;
