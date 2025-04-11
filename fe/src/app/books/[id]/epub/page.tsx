'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Layout, Space, Spin, Typography, Tooltip } from 'antd';
import { LeftOutlined, RightOutlined, ZoomInOutlined, ZoomOutOutlined, ReloadOutlined } from '@ant-design/icons';
import ePub from 'epubjs';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export default function SimpleEpubReader(): React.ReactElement {
    const viewerRef = useRef<HTMLDivElement>(null);
    const [book, setBook] = useState<any>(null);
    const [rendition, setRendition] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [bookTitle, setBookTitle] = useState<string>("Loading EPUB...");
    const [error, setError] = useState<string | null>(null);
    const [fontSize, setFontSize] = useState<number>(100); // Font size as percentage

    // Tải EPUB
    useEffect(() => {
        const loadBook = async () => {
            try {
                setLoading(true);

                // Tải sách mẫu
                const epubUrl = "/test2.epub";
                const epubBook = ePub(epubUrl);

                setBook(epubBook);

                // Lấy metadata
                const metadata = await epubBook.loaded.metadata;
                if (metadata.title) {
                    setBookTitle(metadata.title);
                }

                // Tính tổng số trang
                await epubBook.locations.generate(1024);
                setTotalPages(epubBook.locations.total);

                setLoading(false);
            } catch (err) {
                console.error("Error loading EPUB:", err);
                setError(err instanceof Error ? err.message : "Failed to load EPUB");
                setLoading(false);
            }
        };

        loadBook();

        // Cleanup
        return () => {
            if (book) {
                book.destroy();
            }
        };
    }, []);

    // Khởi tạo rendition khi book đã được tải và container đã sẵn sàng
    useEffect(() => {
        if (book && viewerRef.current) {
            // Tạo rendition với kích thước container
            const renditionInstance = book.renderTo(viewerRef.current, {
                width: '100%',
                height: '100%',
                spread: 'none',
                flow: 'paginated'
            });

            // Hiển thị trang đầu tiên
            renditionInstance.display();

            setRendition(renditionInstance);

            // Theo dõi thay đổi trang
            renditionInstance.on('relocated', (location: any) => {
                setCurrentPage(location.start.cfi ? book.locations.locationFromCfi(location.start.cfi) : 0);
            });
        }

        // Cleanup
        return () => {
            if (rendition) {
                rendition.destroy();
            }
        };
    }, [book, viewerRef.current]);

    // Cập nhật kích thước font khi fontSize thay đổi
    useEffect(() => {
        if (rendition) {
            // Áp dụng style cho rendition
            rendition.themes.fontSize(`${fontSize}%`);
        }
    }, [fontSize, rendition]);

    // Di chuyển trang
    const goNext = () => {
        if (rendition) {
            rendition.next();
        }
    };

    const goPrev = () => {
        if (rendition) {
            rendition.prev();
        }
    };

    // Phóng to font chữ
    const increaseFontSize = () => {
        setFontSize(prevSize => Math.min(prevSize + 10, 200)); // Tăng 10%, tối đa 200%
    };

    // Thu nhỏ font chữ
    const decreaseFontSize = () => {
        setFontSize(prevSize => Math.max(prevSize - 10, 60)); // Giảm 10%, tối thiểu 60%
    };

    // Đặt lại kích thước font chữ
    const resetFontSize = () => {
        setFontSize(100); // Đặt lại về 100%
    };

    // Xử lý phím mũi tên
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight') {
                goNext();
            } else if (event.key === 'ArrowLeft') {
                goPrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [rendition]);

    // Tính phần trăm hoàn thành
    const progress = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

    return (
        <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header style={{
                padding: '0 16px',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between' // Thay đổi từ center để có chỗ cho nút điều chỉnh font
            }}>
                <Title level={4} style={{ margin: 0 }}>{bookTitle}</Title>

                {/* Điều khiển kích thước font */}
                <Space>
                    <Tooltip title="Decrease font size">
                        <Button
                            icon={<ZoomOutOutlined />}
                            onClick={decreaseFontSize}
                            disabled={fontSize <= 60}
                        />
                    </Tooltip>
                    <Tooltip title="Reset font size">
                        <Button
                            onClick={resetFontSize}
                        >
                            {fontSize}%
                        </Button>
                    </Tooltip>
                    <Tooltip title="Increase font size">
                        <Button
                            icon={<ZoomInOutlined />}
                            onClick={increaseFontSize}
                            disabled={fontSize >= 200}
                        />
                    </Tooltip>
                </Space>
            </Header>

            <Content style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                {loading && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10,
                        background: 'rgba(255,255,255,0.7)'
                    }}>
                        <Spin size="large" tip="Loading EPUB..." />
                    </div>
                )}

                {error && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        background: '#fff',
                        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                        borderRadius: '4px',
                        maxWidth: '80%',
                        textAlign: 'center'
                    }}>
                        <Typography.Title level={4} type="danger">Error Loading EPUB</Typography.Title>
                        <Typography.Text>{error}</Typography.Text>
                    </div>
                )}

                <div
                    ref={viewerRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden'
                    }}
                />
            </Content>

            <Footer style={{
                padding: '10px 24px',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Space>
                    <Button
                        icon={<LeftOutlined />}
                        onClick={goPrev}
                    >
                        Previous
                    </Button>
                    <span>Page: {currentPage + 1} / {totalPages || '?'} ({progress}%)</span>
                    <Button
                        icon={<RightOutlined />}
                        onClick={goNext}
                    >
                        Next
                    </Button>
                </Space>
            </Footer>
        </Layout>
    );
}
