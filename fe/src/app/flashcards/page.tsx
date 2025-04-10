'use client';

import React, { useState, useEffect } from 'react';
import {
    Card, Row, Col, Input, Select, Button, Tag, Dropdown, Typography,
    Space, Tooltip, Menu, Empty, Skeleton, Badge, Avatar, message, Form,
    Pagination // Thêm import Pagination
} from 'antd';
import {
    SearchOutlined, PlusOutlined, FilterOutlined,
    EllipsisOutlined, EditOutlined, DeleteOutlined,
    EyeOutlined, CopyOutlined, FolderOutlined,
    LockOutlined, UnlockOutlined, SortAscendingOutlined,
    FolderAddOutlined, DownOutlined, RightOutlined,
    FileAddOutlined, PlayCircleOutlined
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { ROUTES } from '@/config/routes';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { AuthGuard } from "@/components/guards/AuthGuard";

// Import các components modals
import CreateDeckModal from "@/components/decks/CreateDeckModal";
import AddCardModal from "@/components/cards/AddCardModal";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Mock data for decks
const mockDecks = [
    {
        id: 1,
        name: "English Vocabulary",
        description: "Common English words and phrases for everyday use",
        path: "1",
        level: 1,
        color: "#1890ff", // blue
        isPublic: true,
        createdAt: new Date("2023-05-10"),
        updatedAt: new Date("2023-06-15"),
        userId: "user1",
        parentDeckId: null,
        cardCount: 156,
        languageName: "English"
    },
    {
        id: 2,
        name: "Spanish Basics",
        description: "Essential Spanish vocabulary and grammar for beginners",
        path: "2",
        level: 1,
        color: "#52c41a", // green
        isPublic: false,
        createdAt: new Date("2023-01-20"),
        updatedAt: new Date("2023-06-12"),
        userId: "user1",
        parentDeckId: null,
        cardCount: 89,
        languageName: "Spanish"
    },
    {
        id: 3,
        name: "Medical Terminology",
        description: "Common medical terms and definitions for medical students",
        path: "3",
        level: 1,
        color: "#fa8c16", // orange
        isPublic: true,
        createdAt: new Date("2023-03-05"),
        updatedAt: new Date("2023-05-30"),
        userId: "user1",
        parentDeckId: null,
        cardCount: 245,
        languageName: "English"
    },
    {
        id: 4,
        name: "Phrasal Verbs",
        description: "English phrasal verbs with examples and usage notes",
        path: "1/4",
        level: 2,
        color: "#1890ff", // blue
        isPublic: true,
        createdAt: new Date("2023-04-12"),
        updatedAt: new Date("2023-06-10"),
        userId: "user1",
        parentDeckId: 1,
        cardCount: 68,
        languageName: "English"
    },
    {
        id: 5,
        name: "Advanced Spanish",
        description: "Advanced Spanish vocabulary and expressions for fluent speakers",
        path: "2/5",
        level: 2,
        color: "#52c41a", // green
        isPublic: false,
        createdAt: new Date("2023-02-28"),
        updatedAt: new Date("2023-06-05"),
        userId: "user1",
        parentDeckId: 2,
        cardCount: 120,
        languageName: "Spanish"
    },
    {
        id: 6,
        name: "Programming Terms",
        description: "Common programming terminology and concepts",
        path: "6",
        level: 1,
        color: "#722ed1", // purple
        isPublic: false,
        createdAt: new Date("2023-04-25"),
        updatedAt: new Date("2023-06-18"),
        userId: "user1",
        parentDeckId: null,
        cardCount: 112,
        languageName: "English"
    }
];

// Format date for display
const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const FlashCardDecksPage: React.FC = () => {
    const [decks, setDecks] = useState(mockDecks);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState<string>('updatedAt');
    const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');
    const [filterPublic, setFilterPublic] = useState<string>('all');

    // State cho các modal
    const [isCreateDeckModalVisible, setIsCreateDeckModalVisible] = useState(false);
    const [isAddCardModalVisible, setIsAddCardModalVisible] = useState(false);
    const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
    const [selectedDeckName, setSelectedDeckName] = useState<string>('');
    const [addCardLoading, setAddCardLoading] = useState(false);

    // State để theo dõi các deck đang được mở rộng
    const [expandedDecks, setExpandedDecks] = useState<number[]>([]);

    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Simulate data loading
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    // Reset trang khi thay đổi tìm kiếm hoặc bộ lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [searchText, filterPublic]);

    // Handle search
    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    // Handle sorting
    const handleSort = (value: string) => {
        if (value.includes('-')) {
            const [field, order] = value.split('-');
            setSortBy(field);
            setSortOrder(order as 'ascend' | 'descend');
        }
    };

    // Handle creating a new deck
    const showCreateDeckModal = () => {
        setIsCreateDeckModalVisible(true);
    };

    const handleCancelCreateDeck = () => {
        setIsCreateDeckModalVisible(false);
    };

    const handleCreateDeck = async (values: any) => {
        setLoading(true);
        try {
            // Gọi API để tạo deck mới
            console.log('Creating deck with values:', values);

            // Giả lập thời gian gọi API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Thêm deck vào state
            // setDecks([...decks, newDeck]);

            message.success('Deck created successfully!');
            setIsCreateDeckModalVisible(false);
        } catch (error) {
            console.error('Error creating deck:', error);
            message.error('Failed to create deck. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle viewing a deck
    const handleViewDeck = (id: number) => {
        // Navigate to deck detail page
        window.location.href = `${ROUTES.FLASH_CARDS.MY_DECKS}/${id}`;
    };

    // Handle editing a deck
    const handleEditDeck = (id: number) => {
        // Navigate to edit deck page
        window.location.href = `${ROUTES.FLASH_CARDS.MY_DECKS}/${id}/edit`;
    };

    // Handle adding a card to deck
    const handleAddCard = (id: number) => {
        // Lấy thông tin deck được chọn
        const selectedDeck = decks.find(deck => deck.id === id);
        if (selectedDeck) {
            setSelectedDeckId(id);
            setSelectedDeckName(selectedDeck.name);
            setIsAddCardModalVisible(true);
        }
    };

    // Cancel adding card
    const handleCancelAddCard = () => {
        setIsAddCardModalVisible(false);
        setSelectedDeckId(null);
        setSelectedDeckName('');
    };

    // Submit card
    const handleSubmitCard = async (values: any) => {
        setAddCardLoading(true);
        try {
            // Gọi API để thêm card mới
            console.log('Adding card to deck', selectedDeckId, 'with values:', values);

            // Giả lập thời gian gọi API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Cập nhật số lượng card trong deck
            if (selectedDeckId) {
                setDecks(decks.map(deck => {
                    if (deck.id === selectedDeckId) {
                        return { ...deck, cardCount: deck.cardCount + 1 };
                    }
                    return deck;
                }));
            }

            message.success('Card added successfully!');
            setIsAddCardModalVisible(false);
        } catch (error) {
            console.error('Error adding card:', error);
            message.error('Failed to add card. Please try again.');
        } finally {
            setAddCardLoading(false);
        }
    };

    // Handle studying a deck
    const handleStudyDeck = (id: number) => {
        // Navigate to study page
        window.location.href = `${ROUTES.FLASH_CARDS.MY_DECKS}/${id}/study`;
    };

    // Handle deleting a deck
    const handleDeleteDeck = (id: number) => {
        // In a real app, you would call an API to delete the deck
        setDecks(decks.filter(deck => deck.id !== id));
    };

    // Xử lý mở rộng/thu gọn deck
    const toggleExpandDeck = (id: number, e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation(); // Ngăn không cho sự kiện click lan truyền
        }

        if (expandedDecks.includes(id)) {
            setExpandedDecks(expandedDecks.filter(deckId => deckId !== id));
        } else {
            setExpandedDecks([...expandedDecks, id]);
        }
    };

    // Kiểm tra xem deck có deck con không
    const hasChildDecks = (deckId: number) => {
        return decks.some(deck => deck.parentDeckId === deckId);
    };

    // Kiểm tra xem deck có đang được mở rộng không
    const isDeckExpanded = (deckId: number) => {
        return expandedDecks.includes(deckId);
    };

    // Xử lý thay đổi trang
    const handlePageChange = (page: number, size?: number) => {
        setCurrentPage(page);
        if (size) {
            setPageSize(size);
        }
    };

    // Filter và sort decks
    const filteredDecks = decks
        .filter(deck => {
            // Filter logic
            const matchesSearch = deck.name.toLowerCase().includes(searchText.toLowerCase()) ||
                (deck.description && deck.description.toLowerCase().includes(searchText.toLowerCase()));

            const matchesPublic = filterPublic === 'all' ||
                (filterPublic === 'public' && deck.isPublic) ||
                (filterPublic === 'private' && !deck.isPublic);

            const isVisible = deck.level === 1 ||
                (deck.parentDeckId && expandedDecks.includes(deck.parentDeckId));

            return matchesSearch && matchesPublic && isVisible;
        })
        .sort((a, b) => {
            // Sort logic
            if (a.path !== b.path) {
                if (a.path.startsWith(b.path + '/')) return 1;
                if (b.path.startsWith(a.path + '/')) return -1;
            }

            if (sortBy === 'name') {
                return sortOrder === 'ascend'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else if (sortBy === 'cardCount') {
                return sortOrder === 'ascend'
                    ? a.cardCount - b.cardCount
                    : b.cardCount - a.cardCount;
            } else if (sortBy === 'createdAt') {
                return sortOrder === 'ascend'
                    ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else {
                return sortOrder === 'ascend'
                    ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
                    : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            }
        });

    // Tính toán dữ liệu cho trang hiện tại
    const paginatedDecks = filteredDecks.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Render decks trong list view
    const renderDecksList = () => {
        if (loading) {
            return Array(6).fill(0).map((_, index) => (
                <Card style={{ marginBottom: 12 }} key={`skeleton-${index}`}>
                    <Skeleton active />
                </Card>
            ));
        }

        if (filteredDecks.length === 0) {
            return <Empty description="No decks found" />;
        }

        return paginatedDecks.map(deck => (
            <Card
                key={deck.id}
                style={{
                    marginBottom: 12,
                    borderLeft: `3px solid ${deck.color}`,
                    paddingLeft: 8,
                    backgroundColor: deck.level > 1 ? '#f5f5f5' : '#fafafa',
                    marginLeft: deck.level > 1 ? 24 : 0
                }}
                bodyStyle={{ padding: '12px 24px' }}
            >
                {/* Card content, giữ nguyên không thay đổi */}
                <Row align="middle">
                    <Col flex="1">
                        <Space align="center">
                            {deck.level > 1 && <Text type="secondary">↳</Text>}
                            <Avatar
                                shape="square"
                                style={{ backgroundColor: deck.color }}
                                icon={<FolderOutlined />}
                            />
                            <Space direction="vertical" size={0}>
                                <Space align="center">
                                    <Text strong style={{ cursor: 'pointer' }} onClick={() => handleViewDeck(deck.id)}>
                                        {deck.name}
                                    </Text>

                                    {hasChildDecks(deck.id) && (
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={isDeckExpanded(deck.id) ? <DownOutlined /> : <RightOutlined />}
                                            onClick={(e) => toggleExpandDeck(deck.id, e)}
                                        />
                                    )}
                                </Space>
                                <Text
                                    type="secondary"
                                    ellipsis
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleViewDeck(deck.id)}
                                >
                                    {deck.description || "No description"}
                                </Text>
                            </Space>
                        </Space>
                    </Col>

                    <Col>
                        <Space size="middle">
                            <Space>
                                <Tag color="blue">{deck.languageName || "No language"}</Tag>
                                <Tag color="green">{deck.cardCount} cards</Tag>
                                {deck.isPublic ? (
                                    <Tag icon={<UnlockOutlined />} color="blue">Public</Tag>
                                ) : (
                                    <Tag icon={<LockOutlined />} color="default">Private</Tag>
                                )}
                                {deck.level > 1 && <Tag color="orange">Sub-deck</Tag>}
                            </Space>

                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {formatDate(deck.updatedAt)}
                            </Text>

                            <Space>
                                {/* Study button */}
                                <Tooltip title="Study Deck">
                                    <Button
                                        type="text"
                                        icon={<PlayCircleOutlined />}
                                        onClick={() => handleStudyDeck(deck.id)}
                                    />
                                </Tooltip>

                                {/* View button */}
                                <Tooltip title="View Deck">
                                    <Button
                                        type="text"
                                        icon={<EyeOutlined />}
                                        onClick={() => handleViewDeck(deck.id)}
                                    />
                                </Tooltip>

                                {/* Add Card button */}
                                <Tooltip title="Add Card">
                                    <Button
                                        type="text"
                                        icon={<FileAddOutlined />}
                                        onClick={() => handleAddCard(deck.id)}
                                    />
                                </Tooltip>

                                {/* Edit button */}
                                <Tooltip title="Edit Deck">
                                    <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() => handleEditDeck(deck.id)}
                                    />
                                </Tooltip>

                                {/* More options dropdown */}
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            <Menu.Item
                                                key="addCard"
                                                icon={<FileAddOutlined />}
                                                onClick={() => handleAddCard(deck.id)}
                                            >
                                                Add Card
                                            </Menu.Item>
                                            <Menu.Item key="copy" icon={<CopyOutlined />}>
                                                Duplicate
                                            </Menu.Item>
                                            <Menu.Item key="addSubDeck" icon={<FolderAddOutlined />}>
                                                Add Sub-Deck
                                            </Menu.Item>
                                            <Menu.Divider />
                                            <Menu.Item
                                                key="delete"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleDeleteDeck(deck.id)}
                                            >
                                                Delete
                                            </Menu.Item>
                                        </Menu>
                                    }
                                >
                                    <Button type="text" icon={<EllipsisOutlined />} />
                                </Dropdown>
                            </Space>
                        </Space>
                    </Col>
                </Row>
            </Card>
        ));
    };

    return (
        <AuthGuard>
            <DashboardLayout>
                <PageContainer
                    header={{
                        title: 'My Flashcard Decks',
                        subTitle: 'Manage and organize your study decks',
                        extra: [
                            <Button key="create-deck" type="primary" icon={<PlusOutlined />} onClick={showCreateDeckModal}>
                                Create Deck
                            </Button>
                        ]
                    }}
                >
                    {/* Modals */}
                    <CreateDeckModal
                        visible={isCreateDeckModalVisible}
                        onCancel={handleCancelCreateDeck}
                        onSubmit={handleCreateDeck}
                        loading={loading}
                    />

                    <AddCardModal
                        visible={isAddCardModalVisible}
                        deckId={selectedDeckId}
                        deckName={selectedDeckName}
                        onCancel={handleCancelAddCard}
                        onSubmit={handleSubmitCard}
                        loading={addCardLoading}
                    />

                    <Card>
                        <Row gutter={[16, 16]} justify="space-between" align="middle">
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <Input.Search
                                    placeholder="Search decks..."
                                    allowClear
                                    enterButton={<SearchOutlined />}
                                    onSearch={handleSearch}
                                    style={{ maxWidth: 400 }}
                                />
                            </Col>

                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <Row justify="end" gutter={[16, 16]}>
                                    <Col>
                                        <Select
                                            style={{ width: 150 }}
                                            placeholder="Filter by status"
                                            defaultValue="all"
                                            onChange={(value) => setFilterPublic(value)}
                                        >
                                            <Option value="all">All Decks</Option>
                                            <Option value="public">Public Only</Option>
                                            <Option value="private">Private Only</Option>
                                        </Select>
                                    </Col>

                                    <Col>
                                        <Select
                                            style={{ width: 180 }}
                                            placeholder="Sort by"
                                            defaultValue="updatedAt-descend"
                                            onChange={handleSort}
                                        >
                                            <Option value="updatedAt-descend">Latest Updated</Option>
                                            <Option value="updatedAt-ascend">Oldest Updated</Option>
                                            <Option value="createdAt-descend">Recently Created</Option>
                                            <Option value="createdAt-ascend">Oldest Created</Option>
                                            <Option value="name-ascend">Name (A-Z)</Option>
                                            <Option value="name-descend">Name (Z-A)</Option>
                                            <Option value="cardCount-descend">Most Cards</Option>
                                            <Option value="cardCount-ascend">Fewest Cards</Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>

                    <div style={{ marginTop: 16 }}>
                        {renderDecksList()}
                    </div>

                    {/* Phân trang */}
                    {!loading && filteredDecks.length > 0 && (
                        <div style={{ marginTop: 16, textAlign: 'right' }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredDecks.length}
                                onChange={handlePageChange}
                                showSizeChanger
                                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} decks`}
                                pageSizeOptions={['5', '10', '20', '50']}
                            />
                        </div>
                    )}
                </PageContainer>
            </DashboardLayout>
        </AuthGuard>
    );
};

export default FlashCardDecksPage;
