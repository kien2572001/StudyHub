import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

export async function seedCardTemplates() {
    console.log('Bắt đầu seed dữ liệu card templates...');

    // Template học từ vựng tiếng Anh
    const englishVocabTemplate = {
        name: "English Vocabulary Card",
        description: "Template for learning English vocabulary with pronunciation",
        frontStructure: {
            components: [
                {
                    type: "text",
                    name: "word",
                    label: "Word",
                    placeholder: "Enter the English word",
                    required: true,
                    order: 1
                },
                {
                    type: "audio",
                    name: "pronunciation",
                    label: "Pronunciation",
                    required: false,
                    order: 2
                }
            ],
            layout: {
                type: "vertical",
                spacing: "medium"
            }
        },
        backStructure: {
            components: [
                {
                    type: "text",
                    name: "meaning",
                    label: "Meaning",
                    placeholder: "Enter translation or definition",
                    required: true,
                    order: 1
                },
                {
                    type: "select",
                    name: "partOfSpeech",
                    label: "Part of Speech",
                    options: [
                        {"value": "noun", "label": "Noun"},
                        {"value": "verb", "label": "Verb"},
                        {"value": "adjective", "label": "Adjective"},
                        {"value": "adverb", "label": "Adverb"},
                        {"value": "preposition", "label": "Preposition"},
                        {"value": "conjunction", "label": "Conjunction"},
                        {"value": "pronoun", "label": "Pronoun"},
                        {"value": "interjection", "label": "Interjection"},
                        {"value": "other", "label": "Other"}
                    ],
                    required: false,
                    order: 2
                },
                {
                    type: "richText",
                    name: "example",
                    label: "Example",
                    placeholder: "Enter an example sentence with formatting",
                    required: false,
                    order: 3,
                    config: {
                        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'imageUpload', 'blockQuote', '|', 'undo', 'redo'],
                        image: {
                            upload: {
                                types: ['jpeg', 'png', 'gif', 'webp'],
                                maxFileSize: 2000000 // 2MB
                            }
                        },
                        height: '200px'
                    },
                    mediaHandling: {
                        storageType: "upload", // 'upload', 'base64', or 'external'
                        uploadPath: "/api/uploads/images",
                        maxSize: 2000000 // 2MB
                    }
                },
                {
                    type: "textarea",
                    name: "notes",
                    label: "Additional Notes",
                    placeholder: "Enter any additional information",
                    required: false,
                    rows: 2,
                    order: 4
                }
            ],
            layout: {
                type: "vertical",
                spacing: "medium"
            }
        },
        isSystem: true
    };

    // Template học từ vựng tiếng Nhật
    const japaneseVocabTemplate = {
        name: "Japanese Vocabulary Card",
        description: "Template for learning Japanese vocabulary with audio pronunciation",
        frontStructure: {
            components: [
                {
                    type: "text",
                    name: "word",
                    label: "単語 (Word)",
                    placeholder: "日本語の単語を入力してください",
                    required: true,
                    order: 1
                },
                {
                    type: "audio",
                    name: "pronunciation",
                    label: "発音 (Pronunciation)",
                    required: false,
                    order: 2
                }
            ],
            layout: {
                type: "vertical",
                spacing: "medium"
            }
        },
        backStructure: {
            components: [
                {
                    type: "text",
                    name: "reading",
                    label: "読み方 (Reading)",
                    placeholder: "ひらがなで読み方を入力してください",
                    required: false,
                    order: 1
                },
                {
                    type: "text",
                    name: "meaning",
                    label: "意味 (Meaning)",
                    placeholder: "Enter translation or definition",
                    required: true,
                    order: 2
                },
                {
                    type: "select",
                    name: "partOfSpeech",
                    label: "品詞 (Part of Speech)",
                    options: [
                        {"value": "noun", "label": "名詞 (Noun)"},
                        {"value": "verb", "label": "動詞 (Verb)"},
                        {"value": "ichidan", "label": "一段動詞 (Ichidan Verb)"},
                        {"value": "godan", "label": "五段動詞 (Godan Verb)"},
                        {"value": "adjective-i", "label": "イ形容詞 (i-Adjective)"},
                        {"value": "adjective-na", "label": "ナ形容詞 (na-Adjective)"},
                        {"value": "adverb", "label": "副詞 (Adverb)"},
                        {"value": "particle", "label": "助詞 (Particle)"},
                        {"value": "expression", "label": "表現 (Expression)"},
                        {"value": "other", "label": "その他 (Other)"}
                    ],
                    required: false,
                    order: 3
                },
                {
                    type: "richText",
                    name: "example",
                    label: "例文 (Example)",
                    placeholder: "例文を入力してください",
                    required: false,
                    order: 4,
                    config: {
                        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'imageUpload', 'blockQuote', '|', 'undo', 'redo'],
                        image: {
                            upload: {
                                types: ['jpeg', 'png', 'gif', 'webp'],
                                maxFileSize: 2000000 // 2MB
                            }
                        },
                        height: '200px'
                    },
                    mediaHandling: {
                        storageType: "upload", // 'upload', 'base64', or 'external'
                        uploadPath: "/api/uploads/images",
                        maxSize: 2000000 // 2MB
                    }
                },
                {
                    type: "select",
                    name: "jlptLevel",
                    label: "JLPT レベル",
                    options: [
                        {"value": "N5", "label": "N5 (Beginner)"},
                        {"value": "N4", "label": "N4 (Basic)"},
                        {"value": "N3", "label": "N3 (Intermediate)"},
                        {"value": "N2", "label": "N2 (Upper Intermediate)"},
                        {"value": "N1", "label": "N1 (Advanced)"}
                    ],
                    required: false,
                    order: 5
                },
                {
                    type: "textarea",
                    name: "notes",
                    label: "メモ (Notes)",
                    placeholder: "Additional notes",
                    required: false,
                    rows: 2,
                    order: 6
                }
            ],
            layout: {
                type: "vertical",
                spacing: "medium"
            }
        },
        isSystem: true
    };

    const templates = [englishVocabTemplate, japaneseVocabTemplate];

    for (const template of templates) {
        const existingTemplate = await prisma.cardTemplate.findFirst({
            where: {
                name: template.name,
                isSystem: true
            }
        });

        if (existingTemplate) {
            console.log(`Template ${template.name} đã tồn tại.`);
            continue;
        }

        await prisma.cardTemplate.create({
            data: template
        });

        console.log(`Đã tạo thành công template: ${template.name}`);
    }

    console.log('Hoàn thành seed dữ liệu card templates!');
}
