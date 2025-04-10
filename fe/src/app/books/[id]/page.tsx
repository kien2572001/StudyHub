'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    Layout,
    Typography,
    Button,
    Input,
    Slider,
    Menu,
    Dropdown,
    Drawer,
    Tabs,
    Space,
    Tooltip,
    List,
    Divider,
    Form,
    ColorPicker,
    message,
    Spin,
    Progress,
    Select
} from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    SettingOutlined,
    BookOutlined,
    MenuOutlined,
    SearchOutlined,
    FullscreenOutlined,
    TagOutlined,
    EditOutlined,
    FileTextOutlined,
    HighlightOutlined,
    SendOutlined,
    DeleteOutlined,
    CheckOutlined,
    ArrowLeftOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    ReadOutlined,
    ColumnWidthOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { Document, Page as PDFPage, pdfjs } from 'react-pdf';
import { ReaderProvider, useReader } from '@/hooks/userReader';
import { Book, Bookmark, Note, NoteType } from '@/types/book';

// Set PDF.js worker path
//pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
const { Header, Content, Sider, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface ReaderProps {
    bookId: string;
}

// Styles for the reader components
const styles = {
    readerLayout: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column' as const
    },
    readerHeader: {
        padding: '0 16px',
        height: '48px',
        lineHeight: '48px',
        backgroundColor: '#fff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100
    },
    readerContent: {
        flex: 1,
        overflow: 'auto',
        position: 'relative' as const,
        backgroundColor: '#f8f9fa'
    },
    readerSider: {
        backgroundColor: '#fff',
        borderRight: '1px solid #f0f0f0',
        overflow: 'auto'
    },
    readerFooter: {
        padding: '8px 16px',
        height: '44px',
        backgroundColor: '#fff',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    pdfContainer: {
        display: 'flex',
        justifyContent: 'center',
        padding: '20px'
    },
    pageContainer: {
        margin: '0 auto',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative' as const
    },
    navigationControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    toolbarControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    highlightOverlay: {
        position: 'absolute' as const,
        pointerEvents: 'none' as const,
        zIndex: 10
    },
    highlight: {
        position: 'absolute' as const,
        backgroundColor: 'rgba(255, 235, 59, 0.4)',
        cursor: 'pointer',
        zIndex: 5
    },
    notePopover: {
        padding: '12px',
        maxWidth: '300px'
    },
    listItem: {
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        padding: '8px 12px',
        borderRadius: '4px',
        marginBottom: '4px'
    },
    activeListItem: {
        backgroundColor: '#f0f7ff'
    },
    searchInput: {
        marginBottom: '16px'
    },
    highlightMenu: {
        position: 'absolute' as const,
        backgroundColor: '#fff',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '4px',
        zIndex: 100,
        padding: '4px'
    },
    documentWrapper: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        overflow: 'auto'
    }
};

// Theme options
const themes = [
    { value: 'default', label: 'Default (White)', bgColor: '#FFFFFF', textColor: '#000000' },
    { value: 'sepia', label: 'Sepia', bgColor: '#F8F2E2', textColor: '#5F4B32' },
    { value: 'night', label: 'Night Mode', bgColor: '#121212', textColor: '#E0E0E0' },
    { value: 'gray', label: 'Light Gray', bgColor: '#EAECEF', textColor: '#333333' },
];

// The main Reader component
const BookReaderPage: React.FC = () => {
    const searchParams = useSearchParams();
    const bookId = searchParams.get('id') || '1';

    return (
        <ReaderProvider>
            <BookReader bookId={bookId} />
        </ReaderProvider>
    );
};

// Thêm các options để caching document
const options = {
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/standard_fonts/',
};

// Book reader implementation
const BookReader: React.FC<ReaderProps> = ({ bookId }) => {
    const router = useRouter();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(0.9);
    const [siderVisible, setSiderVisible] = useState<boolean>(false);
    const [siderKey, setSiderKey] = useState<string>('toc');
    const [searchText, setSearchText] = useState<string>('');
    const [searchVisible, setSearchVisible] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [theme, setTheme] = useState<string>('default');
    const [fontSize, setFontSize] = useState<number>(16);
    const [lineSpacing, setLineSpacing] = useState<number>(1.5);
    const [margin, setMargin] = useState<number>(2);
    const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
    const [highlights, setHighlights] = useState<Note[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [selectionText, setSelectionText] = useState<string>('');
    const [selectionPosition, setSelectionPosition] = useState<any>(null);
    const [selectedHighlight, setSelectedHighlight] = useState<Note | null>(null);
    const [fullscreen, setFullscreen] = useState<boolean>(false);
    const documentRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Apply theme settings
    const currentTheme = themes.find(t => t.value === theme) || themes[0];
    const readerContentStyle = {
        ...styles.readerContent,
        backgroundColor: currentTheme.bgColor,
        color: currentTheme.textColor,
    };

    useEffect(() => {
        const fetchBook = async () => {
            setLoading(true);
            try {
                // In a real app, this would be an API call
                // Simulating API response with timeout
                setTimeout(() => {
                    // Mock book data
                    const mockBook: Book = {
                        id: parseInt(bookId),
                        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
                        author: 'Robert C. Martin',
                        description: 'Even bad code can function. But if code isnt clean, it can bring a development organization to its knees...',
                        coverUrl: 'https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg',
                        //fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf', // Example PDF
                        fileUrl: '/test.pdf', // Local PDF file
                        fileFormat: 'PDF',
                        fileSize: 4500000,
                        pageCount: 14, // Will be updated by onDocumentLoadSuccess
                        uploadDate: new Date('2023-01-15'),
                        lastOpened: new Date(),
                        userId: 1,
                        tags: JSON.stringify(['programming', 'software', 'technology']),
                    };

                    // Mock bookmarks
                    const mockBookmarks: Bookmark[] = [
                        {
                            id: 1,
                            title: 'Important definition of clean code',
                            position: 0,
                            page: 2,
                            excerpt: 'Clean code is code that has been taken care of...',
                            created_at: new Date('2023-02-10'),
                            userId: 1,
                            bookId: parseInt(bookId)
                        },
                        {
                            id: 2,
                            title: 'Testing principles',
                            position: 0,
                            page: 5,
                            excerpt: 'The three laws of TDD...',
                            created_at: new Date('2023-02-15'),
                            userId: 1,
                            bookId: parseInt(bookId)
                        }
                    ];

                    // Mock highlights and notes
                    const mockNotes: Note[] = [
                        {
                            id: 1,
                            content: 'Key principle to remember about code readability',
                            position_start: 100,
                            position_end: 200,
                            page: 3,
                            highlighted_text: 'Code should be elegant and pleasing to read, like well-crafted prose.',
                            color: 'rgba(255, 235, 59, 0.4)',
                            note_type: 'HIGHLIGHT',
                            created_at: new Date('2023-02-12'),
                            userId: 1,
                            bookId: parseInt(bookId)
                        },
                        {
                            id: 2,
                            content: 'Naming conventions are crucial',
                            position_start: 300,
                            position_end: 350,
                            page: 4,
                            highlighted_text: 'Use intention-revealing names',
                            color: 'rgba(103, 58, 183, 0.4)',
                            note_type: 'TEXT_NOTE',
                            created_at: new Date('2023-02-13'),
                            userId: 1,
                            bookId: parseInt(bookId)
                        }
                    ];

                    setBook(mockBook);
                    setBookmarks(mockBookmarks);
                    const highlightNotes = mockNotes.filter(note => note.note_type === 'HIGHLIGHT');
                    const textNotes = mockNotes.filter(note => note.note_type === 'TEXT_NOTE');
                    setHighlights(highlightNotes);
                    setNotes(textNotes);
                    setLoading(false);
                }, 1500);
            } catch (error) {
                console.error('Error loading book:', error);
                message.error('Failed to load the book. Please try again later.');
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId]);

    // Handle document load success
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        if (book) {
            setBook({ ...book, pageCount: numPages });
        }
        // Set to the bookmarked page if available, otherwise to the first page
        const lastBookmark = bookmarks.length > 0 ? bookmarks[bookmarks.length - 1] : null;
        setPageNumber(lastBookmark?.page || 1);
    };

    // Navigation functions
    const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));
    const goToPage = (page: number) => setPageNumber(Math.min(Math.max(page, 1), numPages || 1));

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isInputFocused = document.activeElement?.tagName === 'INPUT' ||
                document.activeElement?.tagName === 'TEXTAREA';

            if (!isInputFocused) {
                switch (e.key) {
                    case 'ArrowRight':
                        goToNextPage();
                        break;
                    case 'ArrowLeft':
                        goToPrevPage();
                        break;
                    case 'Home':
                        goToPage(1);
                        break;
                    case 'End':
                        goToPage(numPages || 1);
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [numPages]);

    // Zoom functions
    const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 3.0));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
    const resetZoom = () => setScale(1.0);

    // Toggle sidebar visibility
    const toggleSider = (key: string) => {
        if (siderKey === key && siderVisible) {
            setSiderVisible(false);
        } else {
            setSiderKey(key);
            setSiderVisible(true);
        }
    };

    // Add a bookmark at the current page
    const addBookmark = () => {
        const newBookmark: Bookmark = {
            id: Date.now(),
            title: `Page ${pageNumber}`,
            position: 0,
            page: pageNumber,
            excerpt: `Bookmarked on page ${pageNumber}`,
            created_at: new Date(),
            userId: 1,
            bookId: parseInt(bookId)
        };
        setBookmarks([...bookmarks, newBookmark]);
        message.success('Bookmark added');
    };

    // Toggle fullscreen mode
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                message.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
        setFullscreen(!fullscreen);
    };

    // Handle text selection for highlighting
    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Calculate position relative to content
            if (contentRef.current) {
                const contentRect = contentRef.current.getBoundingClientRect();
                const top = rect.top - contentRect.top;
                const left = rect.left - contentRect.left;

                setSelectionText(selection.toString());
                setSelectionPosition({
                    top: top + contentRef.current.scrollTop,
                    left: left,
                    width: rect.width,
                    height: rect.height,
                });
            }
        } else {
            setSelectionText('');
            setSelectionPosition(null);
        }
    };

    // Add a new highlight
    const addHighlight = (color: string = 'rgba(255, 235, 59, 0.4)') => {
        if (selectionText && selectionPosition) {
            const newHighlight: Note = {
                id: Date.now(),
                highlighted_text: selectionText,
                page: pageNumber,
                position_start: selectionPosition.top,
                position_end: selectionPosition.top + selectionPosition.height,
                color: color,
                note_type: 'HIGHLIGHT',
                created_at: new Date(),
                userId: 1,
                bookId: parseInt(bookId)
            };

            setHighlights([...highlights, newHighlight]);
            setSelectionText('');
            setSelectionPosition(null);
            message.success('Highlight added');
        }
    };

    // Add a new note with highlight
    const addNote = () => {
        if (selectionText && selectionPosition) {
            const newNote: Note = {
                id: Date.now(),
                content: '',
                highlighted_text: selectionText,
                page: pageNumber,
                position_start: selectionPosition.top,
                position_end: selectionPosition.top + selectionPosition.height,
                color: 'rgba(103, 58, 183, 0.4)',
                note_type: 'TEXT_NOTE',
                created_at: new Date(),
                userId: 1,
                bookId: parseInt(bookId)
            };

            setNotes([...notes, newNote]);
            setSelectionText('');
            setSelectionPosition(null);
            message.success('Note added');

            // Open the notes tab to edit the new note
            setSiderKey('notes');
            setSiderVisible(true);
        }
    };

    // Update note content
    const updateNote = (id: number, content: string) => {
        setNotes(notes.map(note =>
            note.id === id ? { ...note, content } : note
        ));
    };

    // Delete a note
    const deleteNote = (id: number) => {
        setNotes(notes.filter(note => note.id !== id));
        message.success('Note deleted');
    };

    // Delete a highlight
    const deleteHighlight = (id: number) => {
        setHighlights(highlights.filter(highlight => highlight.id !== id));
        message.success('Highlight deleted');
    };

    // Delete a bookmark
    const deleteBookmark = (id: number) => {
        setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
        message.success('Bookmark deleted');
    };

    // Render bookmarks list
    const renderBookmarksList = () => (
        <>
            <div style={{ padding: '8px 16px' }}>
                <Button
                    type="primary"
                    icon={<TagOutlined />}
                    onClick={addBookmark}
                    block
                >
                    Add Bookmark
                </Button>
            </div>
            <List
                itemLayout="vertical"
                dataSource={bookmarks}
                renderItem={(bookmark) => (
                    <List.Item
                        style={{
                            ...styles.listItem,
                            ...(bookmark.page === pageNumber ? styles.activeListItem : {})
                        }}
                        actions={[
                            <Button
                                key="goto"
                                type="link"
                                size="small"
                                onClick={() => goToPage(bookmark.page || 1)}
                            >
                                Go to page {bookmark.page}
                            </Button>,
                            <Button
                                key="delete"
                                type="text"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => deleteBookmark(bookmark.id)}
                            />
                        ]}
                    >
                        <List.Item.Meta
                            title={bookmark.title}
                            description={new Date(bookmark.created_at).toLocaleString()}
                        />
                        {bookmark.excerpt && <Text ellipsis={{ rows: 2 }}>{bookmark.excerpt}</Text>}
                    </List.Item>
                )}
            />
        </>
    );

    // Render highlights list
    const renderHighlightsList = () => (
        <List
            itemLayout="vertical"
            dataSource={highlights}
            renderItem={(highlight) => (
                <List.Item
                    style={{
                        ...styles.listItem,
                        ...(highlight.page === pageNumber ? styles.activeListItem : {})
                    }}
                    actions={[
                        <Button
                            key="goto"
                            type="link"
                            size="small"
                            onClick={() => goToPage(highlight.page || 1)}
                        >
                            Go to page {highlight.page}
                        </Button>,
                        <Button
                            key="delete"
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => deleteHighlight(highlight.id)}
                        />
                    ]}
                >
                    <div
                        style={{
                            borderLeft: `4px solid ${highlight.color || 'rgba(255, 235, 59, 0.4)'}`,
                            paddingLeft: '8px'
                        }}
                    >
                        <Text ellipsis={{ rows: 3 }}>"{highlight.highlighted_text}"</Text>
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                            Page {highlight.page} • {new Date(highlight.created_at).toLocaleString()}
                        </div>
                    </div>
                </List.Item>
            )}
        />
    );

    // Render notes list
    const renderNotesList = () => (
        <List
            itemLayout="vertical"
            dataSource={notes}
            renderItem={(note) => (
                <List.Item
                    style={{
                        ...styles.listItem,
                        ...(note.page === pageNumber ? styles.activeListItem : {})
                    }}
                    actions={[
                        <Button
                            key="goto"
                            type="link"
                            size="small"
                            onClick={() => goToPage(note.page || 1)}
                        >
                            Go to page {note.page}
                        </Button>,
                        <Button
                            key="delete"
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => deleteNote(note.id)}
                        />
                    ]}
                >
                    <div
                        style={{
                            borderLeft: `4px solid ${note.color || 'rgba(103, 58, 183, 0.4)'}`,
                            paddingLeft: '8px'
                        }}
                    >
                        {note.content && (
                            <Paragraph ellipsis={{ rows: 2 }}>{note.content}</Paragraph>
                        )}
                        {note.highlighted_text && (
                            <Text type="secondary" ellipsis={{ rows: 2 }}>"{note.highlighted_text}"</Text>
                        )}
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                            Page {note.page} • {new Date(note.created_at).toLocaleString()}
                        </div>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                        <TextArea
                            rows={2}
                            placeholder="Add your note here..."
                            value={note.content || ''}
                            onChange={(e) => updateNote(note.id, e.target.value)}
                        />
                    </div>
                </List.Item>
            )}
        />
    );

    // Render highlights as overlays on the PDF page
    const renderHighlightsOverlay = () => {
        const pageHighlights = [...highlights, ...notes].filter(h => h.page === pageNumber);

        return (
            <div style={styles.highlightOverlay}>
                {pageHighlights.map((highlight) => (
                    <div
                        key={highlight.id}
                        style={{
                            ...styles.highlight,
                            backgroundColor: highlight.color || 'rgba(255, 235, 59, 0.4)',
                            top: highlight.position_start,
                            height: (highlight.position_end || 0) - highlight.position_start,
                            width: '80%',
                            left: '10%'
                        }}
                        onClick={() => setSelectedHighlight(highlight)}
                    />
                ))}
            </div>
        );
    };

    // Render the selection menu for highlighting
    const renderSelectionMenu = () => {
        if (!selectionText || !selectionPosition) return null;

        return (
            <div
                style={{
                    ...styles.highlightMenu,
                    top: selectionPosition.top - 40,
                    left: selectionPosition.left
                }}
            >
                <Space>
                    <Tooltip title="Highlight">
                        <Button
                            type="text"
                            icon={<HighlightOutlined style={{ color: '#FFD700' }} />}
                            onClick={() => addHighlight('rgba(255, 235, 59, 0.4)')}
                        />
                    </Tooltip>
                    <Tooltip title="Add Note">
                        <Button
                            type="text"
                            icon={<EditOutlined style={{ color: '#673AB7' }} />}
                            onClick={addNote}
                        />
                    </Tooltip>
                </Space>
            </div>
        );
    };

    // Return to library
    const backToLibrary = () => {
        router.push('/books/library');
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" tip="Loading book..." />
            </div>
        );
    }

    return (
        <Layout style={styles.readerLayout}>
            {/* Reader Header */}
            <Header style={styles.readerHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button type="text" icon={<ArrowLeftOutlined />} onClick={backToLibrary}>
                        Back to Library
                    </Button>
                    <Text ellipsis style={{ maxWidth: '300px' }}>
                        {book?.title}
                    </Text>
                </div>

                <Space>
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={() => toggleSider('toc')}
                    />
                    <Button
                        type="text"
                        icon={<SearchOutlined />}
                        onClick={() => setSearchVisible(!searchVisible)}
                    />
                    <Button
                        type="text"
                        icon={<SettingOutlined />}
                        onClick={() => setSettingsVisible(!settingsVisible)}
                    />
                    <Button
                        type="text"
                        icon={<FullscreenOutlined />}
                        onClick={toggleFullscreen}
                    />
                </Space>
            </Header>

            {/* Reader Layout */}
            <Layout>
                {/* Sidebar for TOC, Bookmarks, Notes, etc. */}
                <Drawer
                    title={
                        <Tabs activeKey={siderKey} onChange={setSiderKey}>
                            <TabPane tab={<span><BookOutlined /> Contents</span>} key="toc" />
                            <TabPane tab={<span><TagOutlined /> Bookmarks</span>} key="bookmarks" />
                            <TabPane tab={<span><HighlightOutlined /> Highlights</span>} key="highlights" />
                            <TabPane tab={<span><EditOutlined /> Notes</span>} key="notes" />
                        </Tabs>
                    }
                    placement="left"
                    closable={true}
                    onClose={() => setSiderVisible(false)}
                    open={siderVisible}
                    width={350}
                >
                    {siderKey === 'toc' && (
                        <div style={{ padding: '0 16px' }}>
                            <Title level={5}>Table of Contents</Title>
                            <Text type="secondary">This book doesn't have a table of contents.</Text>
                        </div>
                    )}

                    {siderKey === 'bookmarks' && renderBookmarksList()}
                    {siderKey === 'highlights' && renderHighlightsList()}
                    {siderKey === 'notes' && renderNotesList()}
                </Drawer>

                {/* Search Drawer */}
                <Drawer
                    title="Search in Book"
                    placement="right"
                    closable={true}
                    onClose={() => setSearchVisible(false)}
                    open={searchVisible}
                    width={350}
                >
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Search text in book..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={styles.searchInput}
                    />

                    <List
                        itemLayout="vertical"
                        dataSource={searchResults}
                        renderItem={(result) => (
                            <List.Item
                                style={styles.listItem}
                                onClick={() => goToPage(result.page)}
                            >
                                <Text ellipsis={{ rows: 3 }}>{result.text}</Text>
                                <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                                    Page {result.page}
                                </div>
                            </List.Item>
                        )}
                        locale={{ emptyText: searchText ? 'No results found' : 'Enter text to search in the book' }}
                    />
                </Drawer>

                {/* Settings Drawer */}
                <Drawer
                    title="Reading Settings"
                    placement="right"
                    closable={true}
                    onClose={() => setSettingsVisible(false)}
                    open={settingsVisible}
                    width={350}
                >
                    <div style={{ marginBottom: '24px' }}>
                        <Title level={5}>Theme</Title>
                        <Select
                            style={{ width: '100%' }}
                            value={theme}
                            onChange={setTheme}
                            options={themes.map(t => ({ value: t.value, label: t.label }))}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <Title level={5}>Font Size</Title>
                        <Space style={{ width: '100%' }} direction="vertical">
                            <Slider
                                min={12}
                                max={24}
                                value={fontSize}
                                onChange={setFontSize}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text type="secondary">Small</Text>
                                <Text style={{ fontSize: fontSize }}>Aa</Text>
                                <Text type="secondary">Large</Text>
                            </div>
                        </Space>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <Title level={5}>Line Spacing</Title>
                        <Slider
                            min={1}
                            max={2.5}
                            step={0.1}
                            value={lineSpacing}
                            onChange={setLineSpacing}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <Title level={5}>Margin</Title>
                        <Slider
                            min={0}
                            max={5}
                            step={0.5}
                            value={margin}
                            onChange={setMargin}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <Title level={5}>PDF Zoom</Title>
                        <Space style={{ width: '100%' }} direction="vertical">
                            <Slider
                                min={0.5}
                                max={2}
                                step={0.1}
                                value={scale}
                                onChange={setScale}
                            />
                            <Space style={{ width: '100%', justifyContent: 'center' }}>
                                <Button icon={<ZoomOutOutlined />} onClick={zoomOut} />
                                <Button onClick={resetZoom}>{Math.round(scale * 100)}%</Button>
                                <Button icon={<ZoomInOutlined />} onClick={zoomIn} />
                            </Space>
                        </Space>
                    </div>
                </Drawer>

                {/* Main Content */}
                <Content
                    style={readerContentStyle}
                    ref={contentRef}
                    onMouseUp={handleTextSelection}
                >
                    <div style={styles.documentWrapper} ref={documentRef}>
                        <Document
                            file={book?.fileUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <Spin tip="Loading PDF..." />
                                </div>
                            }
                            error={
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <Title level={4}>Failed to load PDF</Title>
                                    <Text>There was an error loading the document. Please try again later.</Text>
                                </div>
                            }
                            // options={options}
                            renderMode={"canvas"}
                        >
                            <div style={styles.pdfContainer}>
                                <div style={styles.pageContainer}>
                                    <PDFPage
                                        pageNumber={pageNumber}
                                        width={documentRef.current?.offsetWidth ? documentRef.current.offsetWidth * 0.8 * scale : undefined}
                                        scale={scale}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                    {renderHighlightsOverlay()}
                                </div>
                            </div>
                        </Document>
                        {renderSelectionMenu()}
                    </div>
                </Content>
            </Layout>

            {/* Reader Footer */}
            <Footer style={styles.readerFooter}>
                <div style={styles.navigationControls}>
                    <Button
                        type="text"
                        icon={<LeftOutlined />}
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                    />

                    <Space>
                        <Input
                            type="number"
                            min={1}
                            max={numPages || 1}
                            value={pageNumber}
                            onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                            style={{ width: '60px', textAlign: 'center' }}
                        />
                        <Text type="secondary">/ {numPages || '-'}</Text>
                    </Space>

                    <Button
                        type="text"
                        icon={<RightOutlined />}
                        onClick={goToNextPage}
                        disabled={pageNumber >= (numPages || 1)}
                    />
                </div>

                <Progress
                    type="line"
                    percent={numPages ? Math.round((pageNumber / numPages) * 100) : 0}
                    showInfo={false}
                    style={{ width: '30%' }}
                />

                <div style={styles.toolbarControls}>
                    <Tooltip title="Add Bookmark">
                        <Button type="text" icon={<TagOutlined />} onClick={addBookmark} />
                    </Tooltip>

                    <Tooltip title="Notes & Highlights">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => toggleSider('notes')}
                        />
                    </Tooltip>

                    <Dropdown
                        menu={{
                            items: [
                                { key: '1', label: 'Yellow', icon: <BgColorsOutlined style={{ color: '#FFD700' }} />, onClick: () => addHighlight('rgba(255, 235, 59, 0.4)') },
                                { key: '2', label: 'Green', icon: <BgColorsOutlined style={{ color: '#4CAF50' }} />, onClick: () => addHighlight('rgba(76, 175, 80, 0.4)') },
                                { key: '3', label: 'Blue', icon: <BgColorsOutlined style={{ color: '#2196F3' }} />, onClick: () => addHighlight('rgba(33, 150, 243, 0.4)') },
                                { key: '4', label: 'Purple', icon: <BgColorsOutlined style={{ color: '#673AB7' }} />, onClick: () => addHighlight('rgba(103, 58, 183, 0.4)') },
                            ]
                        }}
                        trigger={['click']}
                        disabled={!selectionText}
                    >
                        <Button type="text" icon={<HighlightOutlined />} />
                    </Dropdown>
                </div>
            </Footer>
        </Layout>
    );
};

// Icons needed for the reader
const ZoomInOutlined = () => <span role="img" aria-label="zoom-in">🔍+</span>;
const ZoomOutOutlined = () => <span role="img" aria-label="zoom-out">🔍-</span>;

export default BookReaderPage;
