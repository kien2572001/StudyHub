'use client';

import React, { useState, useEffect } from 'react';
import {
    Card, Row, Col, Button, Typography, Progress, Statistic,
    Space, Divider, Tag, Spin, Badge, Modal, Tooltip, Image
} from 'antd';
import {
    EyeOutlined, ReloadOutlined, ClockCircleOutlined,
    CheckCircleOutlined, CloseCircleOutlined, RiseOutlined,
    LeftOutlined, RightOutlined, EditOutlined,
    InfoCircleOutlined, SoundOutlined, StarOutlined,
    PauseCircleOutlined, SettingOutlined, BookOutlined
} from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import { PageContainer } from '@ant-design/pro-components';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { AuthGuard } from "@/components/guards/AuthGuard";

const { Title, Text, Paragraph } = Typography;

// Mock data for the current deck
const mockDeck = {
    id: 1,
    name: "English Vocabulary",
    description: "Common English words and phrases for everyday use",
    color: "#1890ff",
    isPublic: true,
    languageName: "English",
    cardCount: 156,
    newCount: 12,
    learningCount: 34,
    dueCount: 8,
    totalReviewed: 102
};

// Mock data for flashcards
const mockCards = [
    {
        id: 1,
        front: "Ubiquitous",
        back: "Present, appearing, or found everywhere.\n\nExample: \"Mobile phones are now ubiquitous in modern society.\"",
        image: "https://images.unsplash.com/photo-1548094891-c4ba474efd16?q=80&w=2070",
        deckId: 1,
        status: "new", // new, learning, or review
        easeFactor: 2.5,
        interval: 1,
        dueDate: new Date(),
        reviewCount: 0,
        lastReviewed: null
    },
    {
        id: 2,
        front: "Ephemeral",
        back: "Lasting for a very short time.\n\nExample: \"The ephemeral nature of fashion trends makes it hard to stay current.\"",
        image: null,
        deckId: 1,
        status: "new",
        easeFactor: 2.5,
        interval: 1,
        dueDate: new Date(),
        reviewCount: 0,
        lastReviewed: null
    },
    {
        id: 3,
        front: "Pragmatic",
        back: "Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.\n\nExample: \"We need a pragmatic approach to solve this problem.\"",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070",
        deckId: 1,
        status: "new",
        easeFactor: 2.5,
        interval: 1,
        dueDate: new Date(),
        reviewCount: 0,
        lastReviewed: null
    },
    {
        id: 4,
        front: "Serendipity",
        back: "The occurrence and development of events by chance in a happy or beneficial way.\n\nExample: \"The discovery of penicillin was a serendipity in medical science.\"",
        image: null,
        deckId: 1,
        status: "new",
        easeFactor: 2.5,
        interval: 1,
        dueDate: new Date(),
        reviewCount: 0,
        lastReviewed: null
    }
];

// Style constants - Reduced front side, optimized back side
const CARD_STYLE = {
    frontSide: {
        minHeight: '180px', // Giảm từ 250px xuống 180px
        padding: '24px 32px', // Giảm padding
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', // Giảm shadow
        display: 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
        transition: 'all 0.3s ease'
    },
    backSide: {
        minHeight: '380px', // Tăng từ 350px lên 380px
        padding: '40px 50px',
        marginTop: '16px', // Giảm margin-top
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
        display: 'flex',
        flexDirection: 'column' as 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#f0f8ff',
        transition: 'all 0.3s ease',
        overflow: 'auto',
        maxHeight: '650px' // Tăng maxHeight từ 600px lên 650px
    },
    statBadge: {
        fontSize: '12px',
        padding: '3px 8px',
        borderRadius: '10px',
        marginRight: '8px',
        display: 'inline-block'
    }
};

const DIFFICULTY_BUTTONS = [
    { key: 'again', text: 'Again', color: '#f5222d', tooltip: 'I didn\'t remember this at all', icon: <CloseCircleOutlined /> },
    { key: 'hard', text: 'Hard', color: '#fa8c16', tooltip: 'I barely remembered this', icon: <ClockCircleOutlined /> },
    { key: 'good', text: 'Good', color: '#52c41a', tooltip: 'I remembered this with some effort', icon: <CheckCircleOutlined /> },
    { key: 'easy', text: 'Easy', color: '#1890ff', tooltip: 'I remembered this perfectly', icon: <RiseOutlined /> }
];

const DeckDetailPage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const deckId = params?.id as string;

    console.log("Current deck ID:", deckId); // Debug log

    const [deck, setDeck] = useState(mockDeck);
    const [cards, setCards] = useState(mockCards);
    const [loading, setLoading] = useState(true);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [studyStats, setStudyStats] = useState({
        correct: 0,
        incorrect: 0,
        skipped: 0,
        totalTime: 0
    });
    const [studyStartTime, setStudyStartTime] = useState<Date | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [imagePreviewVisible, setImagePreviewVisible] = useState(false);

    // Simulate loading data from API
    useEffect(() => {
        setLoading(true);
        console.log("Loading deck with ID:", deckId); // Debug log

        // In a real app, you would fetch the actual data instead of using mock data
        setTimeout(() => {
            // Here you would fetch the actual deck data using the deckId
            setDeck(mockDeck);
            setCards(mockCards);
            setLoading(false);
            setStudyStartTime(new Date());
        }, 1000);
    }, [deckId]);

    // Current card being displayed
    const currentCard = cards[currentCardIndex];

    // Extract definition and example from card back
    const parseCardBack = (backText: string) => {
        const hasExample = backText.includes("Example:");

        if (hasExample) {
            const [definition, exampleWithQuotes] = backText.split("Example:");
            // Remove quotes from example
            const example = exampleWithQuotes.trim().replace(/^"|"$/g, '');
            return { definition: definition.trim(), example };
        }

        return { definition: backText.trim(), example: '' };
    };

    // Handle showing the answer
    const handleShowAnswer = () => {
        setShowAnswer(true);
    };

    // Handle user response to the card
    const handleResponse = (difficulty: string) => {
        // In a real app, you would update the card's review status based on SRS algorithm

        // Update stats based on difficulty
        if (difficulty === 'again') {
            setStudyStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
        } else {
            setStudyStats(prev => ({ ...prev, correct: prev.correct + 1 }));
        }

        // Move to next card or end if this was the last card
        if (currentCardIndex < cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setShowAnswer(false);
        } else {
            // Show completion modal
            Modal.success({
                title: 'Study Session Complete!',
                content: (
                    <div>
                        <p>You've completed all cards in this deck.</p>
                        <Statistic title="Cards Reviewed" value={cards.length} />
                        <Divider />
                        <Row gutter={16}>
                            <Col span={8}>
                                <Statistic
                                    title="Correct"
                                    value={studyStats.correct}
                                    valueStyle={{ color: '#52c41a' }}
                                    suffix={`/ ${cards.length}`}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Incorrect"
                                    value={studyStats.incorrect}
                                    valueStyle={{ color: '#f5222d' }}
                                    suffix={`/ ${cards.length}`}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Accuracy"
                                    value={Math.round((studyStats.correct / cards.length) * 100)}
                                    suffix="%"
                                    precision={0}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Col>
                        </Row>
                    </div>
                ),
                onOk() {
                    // Reset the study session
                    setCurrentCardIndex(0);
                    setShowAnswer(false);
                    setStudyStats({
                        correct: 0,
                        incorrect: 0,
                        skipped: 0,
                        totalTime: 0
                    });
                    setStudyStartTime(new Date());
                }
            });
        }
    };

    // Handle going back to the previous card
    const handlePreviousCard = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(currentCardIndex - 1);
            setShowAnswer(false);
        }
    };

    // Handle skipping the current card
    const handleSkipCard = () => {
        setStudyStats(prev => ({ ...prev, skipped: prev.skipped + 1 }));

        if (currentCardIndex < cards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setShowAnswer(false);
        }
    };

    // Handle pausing the study session
    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    // Handle image preview
    const toggleImagePreview = () => {
        setImagePreviewVisible(!imagePreviewVisible);
    };

    // Parse the current card's back content
    const { definition, example } = parseCardBack(currentCard?.back || '');

    if (loading) {
        return (
            <AuthGuard>
                <DashboardLayout>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                        <Spin size="large" tip="Loading deck..." />
                    </div>
                </DashboardLayout>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard>
            <DashboardLayout>
                <PageContainer
                    header={{
                        title: deck.name,
                        subTitle: deck.description,
                        ghost: false,
                        backIcon: <LeftOutlined />,
                        onBack: () => router.back(),
                        extra: [
                            <Button key="edit" icon={<EditOutlined />}>
                                Edit Deck
                            </Button>,
                            <Button key="settings" icon={<SettingOutlined />}>
                                Settings
                            </Button>,
                        ],
                        tags: deck.isPublic ? (
                            <Tag color="blue">Public</Tag>
                        ) : (
                            <Tag color="default">Private</Tag>
                        ),
                    }}
                >
                    {/* Deck Statistics and Current Session Stats (Combined) */}
                    <Card style={{ marginBottom: 16 }}>
                        <Row gutter={[24, 16]} align="middle">
                            {/* Deck Stats */}
                            <Col xs={24} sm={8} md={8} lg={6}>
                                <Row gutter={[16, 16]}>
                                    <Col span={8}>
                                        <Badge.Ribbon text="New" color="blue">
                                            <Card size="small">
                                                <Statistic
                                                    value={deck.newCount}
                                                    valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                                                />
                                            </Card>
                                        </Badge.Ribbon>
                                    </Col>
                                    <Col span={8}>
                                        <Badge.Ribbon text="Learning" color="orange">
                                            <Card size="small">
                                                <Statistic
                                                    value={deck.learningCount}
                                                    valueStyle={{ color: '#fa8c16', fontSize: '24px' }}
                                                />
                                            </Card>
                                        </Badge.Ribbon>
                                    </Col>
                                    <Col span={8}>
                                        <Badge.Ribbon text="Due" color="green">
                                            <Card size="small">
                                                <Statistic
                                                    value={deck.dueCount}
                                                    valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                                                />
                                            </Card>
                                        </Badge.Ribbon>
                                    </Col>
                                </Row>
                            </Col>

                            {/* Progress */}
                            <Col xs={24} sm={10} md={10} lg={12}>
                                <Row gutter={[16, 16]} align="middle">
                                    <Col span={24}>
                                        <Text>Study Progress</Text>
                                        <Progress
                                            percent={Math.round((deck.totalReviewed / deck.cardCount) * 100)}
                                            status="active"
                                            strokeColor={{
                                                '0%': '#108ee9',
                                                '100%': '#87d068',
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Col>

                            {/* Current Session Stats - Compact */}
                            <Col xs={24} sm={6} md={6} lg={6}>
                                <div style={{ textAlign: 'right' }}>
                                    <Text type="secondary">Session Stats:</Text>
                                    <div style={{ marginTop: 8 }}>
                                        <span style={{
                                            ...CARD_STYLE.statBadge,
                                            backgroundColor: 'rgba(82, 196, 26, 0.1)',
                                            border: '1px solid #52c41a',
                                            color: '#52c41a'
                                        }}>
                                            <CheckCircleOutlined /> {studyStats.correct}
                                        </span>
                                        <span style={{
                                            ...CARD_STYLE.statBadge,
                                            backgroundColor: 'rgba(245, 34, 45, 0.1)',
                                            border: '1px solid #f5222d',
                                            color: '#f5222d'
                                        }}>
                                            <CloseCircleOutlined /> {studyStats.incorrect}
                                        </span>
                                        <Tooltip title={`${studyStats.correct + studyStats.incorrect} of ${cards.length} cards studied`}>
                                            <span style={{
                                                ...CARD_STYLE.statBadge,
                                                backgroundColor: 'rgba(24, 144, 255, 0.1)',
                                                border: '1px solid #1890ff',
                                                color: '#1890ff'
                                            }}>
                                                {currentCardIndex + 1}/{cards.length}
                                            </span>
                                        </Tooltip>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* Study Area - Main Flashcard */}
                    <Card
                        title={
                            <Space>
                                <Text strong>Flashcard {currentCardIndex + 1}</Text>
                                <Tag color="blue">{currentCard?.status || 'New'}</Tag>
                            </Space>
                        }
                        extra={
                            <Space>
                                <Button
                                    type="text"
                                    icon={isPaused ? <ClockCircleOutlined /> : <PauseCircleOutlined />}
                                    onClick={togglePause}
                                >
                                    {isPaused ? 'Resume' : 'Pause'}
                                </Button>
                                <Tooltip title="Skip this card">
                                    <Button type="text" icon={<RightOutlined />} onClick={handleSkipCard} />
                                </Tooltip>
                            </Space>
                        }
                        style={{ marginBottom: 32 }}
                    >
                        {isPaused ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <Title level={3}>Study Session Paused</Title>
                                <Paragraph>Take a break and resume when you're ready.</Paragraph>
                                <Button type="primary" onClick={togglePause}>Resume Study</Button>
                            </div>
                        ) : (
                            <>
                                {/* Card Front - Compact Version */}
                                <div style={CARD_STYLE.frontSide}>
                                    <Title level={2} style={{ textAlign: 'center', marginBottom: 12 }}>
                                        {currentCard.front}
                                    </Title>
                                    <Space size="small">
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<SoundOutlined />}
                                            onClick={() => console.log('Play pronunciation')}
                                        >
                                            Listen
                                        </Button>
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<StarOutlined />}
                                            onClick={() => console.log('Mark as favorite')}
                                        >
                                            Favorite
                                        </Button>
                                    </Space>
                                </div>

                                {/* Actions */}
                                <div style={{ textAlign: 'center', margin: '16px 0' }}>
                                    {!showAnswer ? (
                                        <Button
                                            type="primary"
                                            size="large"
                                            icon={<EyeOutlined />}
                                            onClick={handleShowAnswer}
                                        >
                                            Show Answer
                                        </Button>
                                    ) : (
                                        <Space size="large">
                                            {DIFFICULTY_BUTTONS.map(button => (
                                                <Tooltip key={button.key} title={button.tooltip}>
                                                    <Button
                                                        type="default"
                                                        size="large"
                                                        icon={button.icon}
                                                        style={{
                                                            borderColor: button.color,
                                                            color: button.color
                                                        }}
                                                        onClick={() => handleResponse(button.key)}
                                                    >
                                                        {button.text}
                                                    </Button>
                                                </Tooltip>
                                            ))}
                                        </Space>
                                    )}
                                </div>

                                {/* Card Back - Enhanced Version */}
                                {showAnswer && (
                                    <div style={CARD_STYLE.backSide}>
                                        <Title level={4} style={{ marginBottom: 16, textAlign: 'center' }}>
                                            <BookOutlined /> Đáp án
                                        </Title>
                                        <Divider style={{ margin: '8px 0 20px' }} />

                                        {/* Main definition */}
                                        <Paragraph
                                            style={{
                                                fontSize: '18px',
                                                lineHeight: '1.8',
                                                textAlign: 'left'
                                            }}
                                        >
                                            {definition}
                                        </Paragraph>

                                        {/* Example section with distinct styling */}
                                        {example && (
                                            <div style={{
                                                marginTop: 24,
                                                padding: '16px 20px',
                                                backgroundColor: 'rgba(24, 144, 255, 0.1)',
                                                borderRadius: '6px',
                                                borderLeft: '4px solid #1890ff'
                                            }}>
                                                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                                                    Example:
                                                </Text>
                                                <Text style={{ display: 'block', fontStyle: 'italic', fontSize: '16px' }}>
                                                    "{example}"
                                                </Text>
                                            </div>
                                        )}

                                        {/* Image section if available */}
                                        {currentCard.image && (
                                            <div style={{ marginTop: 24, textAlign: 'center' }}>
                                                <Divider>
                                                    <Text type="secondary">Related Image</Text>
                                                </Divider>
                                                <Image
                                                    src={currentCard.image}
                                                    alt={`Illustration for ${currentCard.front}`}
                                                    style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain' }}
                                                    preview={{
                                                        visible: imagePreviewVisible,
                                                        onVisibleChange: toggleImagePreview,
                                                        src: currentCard.image,
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Additional tools */}
                                        <div style={{ marginTop: 24, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                                            <Button
                                                type="text"
                                                icon={<SoundOutlined />}
                                                onClick={() => console.log('Play pronunciation')}
                                            >
                                                Listen to Pronunciation
                                            </Button>
                                            <Divider type="vertical" style={{ height: '24px' }} />
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={() => console.log('Edit card')}
                                            >
                                                Edit Card
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation */}
                                <Row style={{ marginTop: 24 }}>
                                    <Col span={12} style={{ textAlign: 'left' }}>
                                        <Button
                                            type="text"
                                            disabled={currentCardIndex === 0}
                                            icon={<LeftOutlined />}
                                            onClick={handlePreviousCard}
                                        >
                                            Previous
                                        </Button>
                                    </Col>
                                    <Col span={12} style={{ textAlign: 'right' }}>
                                        <Text type="secondary">
                                            {currentCardIndex + 1} / {cards.length}
                                        </Text>
                                    </Col>
                                </Row>
                            </>
                        )}
                    </Card>
                </PageContainer>
            </DashboardLayout>
        </AuthGuard>
    );
};

export default DeckDetailPage;
