// types/book.ts
export interface Book {
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
    tags?: string;
    readingProgress?: number; // Thêm trường này để lưu % đã đọc (từ 0-100)
    currentPage?: number; // Trang hiện tại đang đọc
}

export interface Bookmark {
    id: number;
    title?: string;
    position: number;
    page?: number;
    excerpt?: string;
    created_at: Date;
    userId: number;
    bookId: number;

    epubCfi?: string; // Thêm trường này để lưu CFI trong EPUB
}

export enum NoteType {
    HIGHLIGHT = 'HIGHLIGHT',
    TEXT_NOTE = 'TEXT_NOTE',
    DRAWING = 'DRAWING'
}

export interface Note {
    id: number;
    content?: string;
    position_start?: number;
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

    epubCfi?: string; // Thêm trường này để lưu CFI trong EPUB
}
