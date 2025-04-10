'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { AuthGuard } from "@/components/guards/AuthGuard";
import {
    Layout,
    Typography,
    Button,
    Input,
    Select,
    Space,
    Row,
    Col,
    Card,
    Tag,
    Divider,
    Modal,
    Form,
    Upload,
    Empty,
    message
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    UploadOutlined,
    BookOutlined,
    EditOutlined,
    TagOutlined,
    EllipsisOutlined,
    InboxOutlined,
    OrderedListOutlined,
    ReadOutlined
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Content } from 'antd/lib/layout/layout';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;
const { Dragger } = Upload;

// Interface for Book model with camelCase
interface Book {
    id: number;
    title: string;
    author?: string;
    description?: string;
    coverUrl?: string;
    fileUrl: string;
    fileFormat: 'PDF' | 'EPUB' | 'MOBI' | 'TXT' | 'DOC' | 'DOCX' | 'RTF' | 'HTML' | 'OTHER';
    fileSize: number;
    pageCount?: number;
    contentHash?: string;
    uploadDate: Date;
    lastOpened?: Date;
    userId: number;
    tags?: string; // JSON string: ["fiction", "thriller"]
    bookmarks?: Bookmark[];
    notes?: Note[];
    bookContent?: BookContent;
}

interface BookContent {
    id: number;
    bookId: number;
    content: string;
    contentVector?: string;
}

interface Bookmark {
    id: number;
    title?: string;
    position: number;
    page?: number;
    excerpt?: string;
    created_at: Date;
    userId: number;
    bookId: number;
}

interface Note {
    id: number;
    content?: string;
    position_start: number;
    position_end?: number;
    page?: number;
    highlighted_text?: string;
    color?: string;
    note_type: 'HIGHLIGHT' | 'TEXT_NOTE' | 'DRAWING';
    created_at: Date;
    updated_at?: Date;
    userId: number;
    bookId: number;
    drawing_data?: string;
}

// Page filters
interface BookFilters {
    searchTerm: string;
    format: string;
    sortBy: string;
    tags: string[];
}

// Main component
const BookLibraryPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [filters, setFilters] = useState<BookFilters>({
        searchTerm: '',
        format: 'all',
        sortBy: 'recent',
        tags: []
    });
    const [showFilters, setShowFilters] = useState(false);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    // Simulate fetching books from API
    useEffect(() => {
        // Mock API call
        const fetchBooks = async () => {
            setLoading(true);
            try {
                // In a real scenario, this would be an API call
                // Currently using sample data
                setTimeout(() => {
                    const mockBooks: Book[] = [
                        {
                            id: 1,
                            title: 'Clean Code',
                            author: 'Robert C. Martin',
                            description: 'A handbook of agile software craftsmanship',
                            coverUrl: 'https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg',
                            fileUrl: '/books/clean-code.pdf',
                            fileFormat: 'PDF',
                            fileSize: 4500000,
                            pageCount: 464,
                            uploadDate: new Date('2023-01-15'),
                            lastOpened: new Date('2023-03-20'),
                            userId: 1,
                            tags: JSON.stringify(['programming', 'software', 'technology']),
                            bookmarks: [{
                                id: 1,
                                title: 'Important definition',
                                position: 1500,
                                page: 42,
                                created_at: new Date('2023-02-10'),
                                userId: 1,
                                bookId: 1
                            }],
                            notes: [{
                                id: 1,
                                content: 'Key principle to remember',
                                position_start: 2000,
                                position_end: 2200,
                                page: 55,
                                highlighted_text: 'Always write clean and maintainable code',
                                color: 'yellow',
                                note_type: 'HIGHLIGHT',
                                created_at: new Date('2023-02-12'),
                                userId: 1,
                                bookId: 1
                            }],
                            bookContent: {
                                id: 1,
                                bookId: 1,
                                content: 'Full text content of the book would be here...'
                            }
                        },
                        {
                            id: 2,
                            title: 'The Pragmatic Programmer',
                            author: 'Andrew Hunt, David Thomas',
                            coverUrl: 'https://m.media-amazon.com/images/I/51cUVaBWZzL._SX380_BO1,204,203,200_.jpg',
                            fileUrl: '/books/pragmatic-programmer.epub',
                            fileFormat: 'EPUB',
                            fileSize: 3200000,
                            pageCount: 352,
                            uploadDate: new Date('2023-02-05'),
                            userId: 1,
                            tags: JSON.stringify(['programming', 'career']),
                            bookmarks: [],
                            notes: []
                        },
                        {
                            id: 3,
                            title: 'Design Patterns',
                            author: 'Erich Gamma et al',
                            fileUrl: '/books/design-patterns.pdf',
                            fileFormat: 'PDF',
                            fileSize: 5100000,
                            uploadDate: new Date('2023-03-10'),
                            userId: 1,
                            tags: JSON.stringify(['programming', 'design']),
                            bookmarks: [],
                            notes: []
                        }
                    ];
                    setBooks(mockBooks);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Failed to fetch books:', error);
                message.error('Failed to load book list. Please try again later.');
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Filter books based on filters
    const filteredBooks = React.useMemo(() => {
        return books.filter(book => {
            // Filter by search term
            if (filters.searchTerm && !book.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
                !(book.author && book.author.toLowerCase().includes(filters.searchTerm.toLowerCase()))) {
                return false;
            }

            // Filter by format
            if (filters.format !== 'all' && book.fileFormat !== filters.format) {
                return false;
            }

            // Filter by tags
            if (filters.tags.length > 0) {
                const bookTags = book.tags ? JSON.parse(book.tags) : [];
                if (!filters.tags.some(tag => bookTags.includes(tag))) {
                    return false;
                }
            }

            return true;
        }).sort((a, b) => {
            // Sort by criteria
            switch (filters.sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'author':
                    return (a.author || '').localeCompare(b.author || '');
                case 'lastRead':
                    return (b.lastOpened?.getTime() || 0) - (a.lastOpened?.getTime() || 0);
                case 'recent':
                default:
                    return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
            }
        });
    }, [books, filters]);

    const handleUpload = (values: any) => {
        // Simulate book upload
        message.success('Book uploaded successfully!');
        setUploadModalVisible(false);

        // In a real scenario, this would be an API call to save the new book
        // Currently adding a simulated book to the state
        const newBook: Book = {
            id: books.length + 1,
            title: values.title,
            author: values.author,
            description: values.description,
            fileUrl: URL.createObjectURL(values.file.file),
            fileFormat: values.file.file.name.split('.').pop().toUpperCase(),
            fileSize: values.file.file.size,
            uploadDate: new Date(),
            userId: 1,
            tags: values.tags ? JSON.stringify(values.tags) : undefined,
            bookmarks: [],
            notes: []
        };

        setBooks([newBook, ...books]);
    };

    return (
        <AuthGuard>
            <DashboardLayout>
                <PageContainer
                    title="My Book Library"
                    loading={loading}
                    extra={[
                        <Button
                            key="upload"
                            type="primary"
                            icon={<UploadOutlined />}
                            onClick={() => setUploadModalVisible(true)}
                        >
                            Upload Book
                        </Button>
                    ]}
                >
                    <Content style={{ padding: '0 24px', marginTop: 0 }}>
                        {/* Search and Filter Bar */}
                        <Card style={{ marginBottom: 24 }}>
                            <Row gutter={16} align="middle">
                                <Col xs={24} md={8}>
                                    <Search
                                        placeholder="Search by title, author, content..."
                                        allowClear
                                        enterButton={<SearchOutlined />}
                                        size="large"
                                        value={filters.searchTerm}
                                        onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                                    />
                                </Col>

                                <Col xs={12} md={4}>
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="Format"
                                        value={filters.format}
                                        onChange={(value) => setFilters({...filters, format: value})}
                                    >
                                        <Option value="all">All Formats</Option>
                                        <Option value="PDF">PDF</Option>
                                        <Option value="EPUB">EPUB</Option>
                                        <Option value="MOBI">MOBI</Option>
                                        <Option value="TXT">TXT</Option>
                                        <Option value="DOC">DOC</Option>
                                        <Option value="DOCX">DOCX</Option>
                                        <Option value="RTF">RTF</Option>
                                        <Option value="HTML">HTML</Option>
                                        <Option value="OTHER">Other</Option>
                                    </Select>
                                </Col>

                                <Col xs={12} md={4}>
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="Sort by"
                                        value={filters.sortBy}
                                        onChange={(value) => setFilters({...filters, sortBy: value})}
                                    >
                                        <Option value="recent">Recently Added</Option>
                                        <Option value="lastRead">Recently Read</Option>
                                        <Option value="title">Title</Option>
                                        <Option value="author">Author</Option>
                                    </Select>
                                </Col>

                                <Col xs={24} md={4}>
                                    <Button
                                        type="default"
                                        icon={<FilterOutlined />}
                                        onClick={() => setShowFilters(!showFilters)}
                                        style={{ width: '100%' }}
                                    >
                                        Advanced Filter
                                    </Button>
                                </Col>

                                <Col xs={24} md={4}>
                                    <Button
                                        type="default"
                                        icon={<OrderedListOutlined />}
                                        style={{ width: '100%' }}
                                    >
                                        Sort
                                    </Button>
                                </Col>
                            </Row>

                            {/* Advanced Filters (Expandable) */}
                            {showFilters && (
                                <div style={{ marginTop: 16 }}>
                                    <Divider orientation="left">Filter by Tags</Divider>
                                    <Space wrap>
                                        {['programming', 'fiction', 'non-fiction', 'science', 'history', 'technology', 'design', 'business'].map(tag => (
                                            <Tag.CheckableTag
                                                key={tag}
                                                checked={filters.tags.includes(tag)}
                                                onChange={checked => {
                                                    const newTags = checked
                                                        ? [...filters.tags, tag]
                                                        : filters.tags.filter(t => t !== tag);
                                                    setFilters({...filters, tags: newTags});
                                                }}
                                            >
                                                {tag}
                                            </Tag.CheckableTag>
                                        ))}
                                    </Space>
                                </div>
                            )}
                        </Card>

                        {/* Book Grid */}
                        <Row gutter={[16, 16]}>
                            {filteredBooks.length > 0 ? (
                                filteredBooks.map(book => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={book.id}>
                                        <BookCard book={book} />
                                    </Col>
                                ))
                            ) : (
                                <Col span={24}>
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={loading ? 'Loading books...' : 'No books found. Try a different search or upload a book.'}
                                    >
                                        {!loading && (
                                            <Button
                                                type="primary"
                                                icon={<UploadOutlined />}
                                                onClick={() => setUploadModalVisible(true)}
                                            >
                                                Upload Book
                                            </Button>
                                        )}
                                    </Empty>
                                </Col>
                            )}
                        </Row>
                    </Content>

                    {/* Upload Modal */}
                    <UploadBookModal
                        visible={uploadModalVisible}
                        onCancel={() => setUploadModalVisible(false)}
                        onUpload={handleUpload}
                    />
                </PageContainer>
            </DashboardLayout>
        </AuthGuard>
    );
};

// Book Card Component
const BookCard: React.FC<{ book: Book }> = ({ book }) => {
    return (
        <Card
            hoverable
            cover={
                <div style={{ position: 'relative', height: 200, background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                        alt={book.title}
                        src={book.coverUrl || '/images/default-book-cover.jpg'}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                    <Tag
                        color="default"
                        style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                    >
                        {book.fileFormat}
                    </Tag>
                </div>
            }
            actions={[
                <Button type="text" key="read" icon={<ReadOutlined />}>Read</Button>,
                <Button type="text" key="details" icon={<BookOutlined />}>Details</Button>,
                <Button type="text" icon={<EllipsisOutlined />} key="more" />
            ]}
        >
            <Card.Meta
                title={book.title}
                description={book.author || 'Unknown Author'}
            />

            <div style={{ marginTop: 12 }}>
                {book.tags && JSON.parse(book.tags).slice(0, 2).map((tag: string) => (
                    <Tag key={tag}>{tag}</Tag>
                ))}
                {book.tags && JSON.parse(book.tags).length > 2 && (
                    <Tag>+{JSON.parse(book.tags).length - 2}</Tag>
                )}
            </div>

            <Space style={{ marginTop: 16 }}>
                <Space size={4}>
                    <TagOutlined />
                    <Text type="secondary">{book.bookmarks?.length || 0}</Text>
                </Space>
                <Space size={4}>
                    <EditOutlined />
                    <Text type="secondary">{book.notes?.length || 0}</Text>
                </Space>
            </Space>
        </Card>
    );
};

// Upload Modal Component
const UploadBookModal: React.FC<{
    visible: boolean;
    onCancel: () => void;
    onUpload: (values: any) => void;
}> = ({ visible, onCancel, onUpload }) => {
    const [form] = Form.useForm();

    const handleSubmit = () => {
        form.validateFields().then(values => {
            onUpload(values);
            form.resetFields();
        });
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <Modal
            title="Upload Book"
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            okText="Upload"
            cancelText="Cancel"
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please enter the book title!' }]}
                >
                    <Input placeholder="Enter book title" />
                </Form.Item>

                <Form.Item
                    name="author"
                    label="Author"
                >
                    <Input placeholder="Enter author name" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                >
                    <Input.TextArea
                        placeholder="Brief description of the book"
                        rows={3}
                    />
                </Form.Item>

                <Form.Item
                    name="tags"
                    label="Tags"
                >
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Enter or select tags"
                        options={[
                            { value: 'programming', label: 'Programming' },
                            { value: 'fiction', label: 'Fiction' },
                            { value: 'non-fiction', label: 'Non-fiction' },
                            { value: 'science', label: 'Science' },
                            { value: 'history', label: 'History' },
                            { value: 'biography', label: 'Biography' },
                            { value: 'technology', label: 'Technology' },
                            { value: 'design', label: 'Design' },
                            { value: 'business', label: 'Business' },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="file"
                    label="Book File"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: 'Please upload a book file!' }]}
                >
                    <Dragger
                        accept=".pdf,.epub,.mobi,.txt,.doc,.docx,.rtf,.html"
                        beforeUpload={() => false}
                        maxCount={1}
                        listType="picture"
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Supported formats: PDF, EPUB, MOBI, TXT, DOC, DOCX, RTF, HTML
                        </p>
                    </Dragger>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BookLibraryPage;
