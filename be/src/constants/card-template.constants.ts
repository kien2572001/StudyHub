// src/constants/cardComponentTypes.ts

/**
 * Constants for card template component types with examples
 */

export const CARD_COMPONENT_TYPES = {
    // TEXT: Trường văn bản một dòng
    TEXT: {
        type: "text",
        example: {
            type: "text",
            name: "term",
            label: "Từ vựng",
            placeholder: "Nhập từ vựng",
            required: true
        }
    },

    // TEXTAREA: Trường văn bản nhiều dòng
    TEXTAREA: {
        type: "textarea",
        example: {
            type: "textarea",
            name: "definition",
            label: "Định nghĩa",
            placeholder: "Nhập định nghĩa chi tiết",
            rows: 4,
            required: true
        }
    },

    // SELECT: Trường lựa chọn từ danh sách
    SELECT: {
        type: "select",
        example: {
            type: "select",
            name: "partOfSpeech",
            label: "Loại từ",
            options: [
                {"value": "noun", "label": "Danh từ"},
                {"value": "verb", "label": "Động từ"},
                {"value": "adjective", "label": "Tính từ"}
            ],
            required: false
        }
    },

    // IMAGE: Trường tải lên hình ảnh
    IMAGE: {
        type: "image",
        example: {
            type: "image",
            name: "illustration",
            label: "Hình minh họa",
            maxSize: 2048000,
            allowedTypes: ["image/jpeg", "image/png"]
        }
    },

    // AUDIO: Trường tải lên âm thanh
    AUDIO: {
        type: "audio",
        example: {
            type: "audio",
            name: "pronunciation",
            label: "Phát âm",
            maxSize: 5000000,
            allowedTypes: ["audio/mp3", "audio/wav"]
        }
    },

    // CHECKBOX: Trường kiểu đánh dấu
    CHECKBOX: {
        type: "checkbox",
        example: {
            type: "checkbox",
            name: "isFavorite",
            label: "Thêm vào yêu thích"
        }
    },

    // MARKDOWN: Trường nhập liệu định dạng markdown
    MARKDOWN: {
        type: "markdown",
        example: {
            type: "markdown",
            name: "explanation",
            label: "Giải thích",
            toolbar: ["bold", "italic", "link", "list"]
        }
    },
    // RICH_TEXT: Trường soạn thảo văn bản phong phú sử dụng CKEditor
    RICH_TEXT: {
        type: "richText",
        example: {
            type: "richText",
            name: "content",
            label: "Nội dung chi tiết",
            placeholder: "Nhập nội dung phong phú...",
            required: false,
            config: {
                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', '|', 'undo', 'redo'],
                image: {
                    upload: {
                        types: ['jpeg', 'png', 'gif', 'webp'],
                        maxFileSize: 5000000 // 5MB
                    }
                },
                height: '300px'
            },
            // Chứa thông tin về cách xử lý media được nhúng
            mediaHandling: {
                storageType: "external", // 'external', 'base64', 'upload'
                uploadPath: "/api/uploads", // Đường dẫn API để upload hình ảnh (nếu storageType là 'upload')
                maxSize: 5000000 // Kích thước tối đa cho media
            }
        }
    }
};

// Layout types for components
export const LAYOUT_TYPES = {
    VERTICAL: "vertical",
    HORIZONTAL: "horizontal",
    GRID: "grid"
};

// Spacing options
export const SPACING_OPTIONS = {
    NONE: "none",
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large"
};
