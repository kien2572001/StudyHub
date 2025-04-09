import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDecks() {
    console.log('Bắt đầu seed dữ liệu deck từ vựng...');

    // Lấy user đầu tiên trong hệ thống
    const firstUser = await prisma.user.findFirst();
    if (!firstUser) {
        throw new Error('Không tìm thấy user trong hệ thống. Vui lòng tạo user trước.');
    }
    console.log(`Đã tìm thấy user: ${firstUser.name} (${firstUser.id})`);

    // Lấy thông tin ngôn ngữ
    const englishLanguage = await prisma.language.findUnique({
        where: { code: 'en' }
    });

    const japaneseLanguage = await prisma.language.findUnique({
        where: { code: 'ja' }
    });

    if (!englishLanguage || !japaneseLanguage) {
        throw new Error('Không tìm thấy ngôn ngữ Tiếng Anh hoặc Tiếng Nhật. Vui lòng chạy seed ngôn ngữ trước.');
    }

    // Tạo deck từ vựng tiếng Anh
    const englishDeck = await prisma.deck.create({
        data: {
            name: 'Essential English Vocabulary',
            description: 'Common English words for beginners',
            color: '#4285F4', // Google Blue
            isPublic: true,
            path: '', // Temporary path, will update after creation
            level: 1,
            userId: firstUser.id,
            languageId: englishLanguage.id
        }
    });

    // Cập nhật path cho deck tiếng Anh
    await prisma.deck.update({
        where: { id: englishDeck.id },
        data: { path: `${englishDeck.id}` }
    });

    console.log(`Đã tạo deck tiếng Anh: ${englishDeck.name} (ID: ${englishDeck.id})`);

    // Tạo deck từ vựng tiếng Nhật
    const japaneseDeck = await prisma.deck.create({
        data: {
            name: 'Basic Japanese Vocabulary',
            description: 'Essential Japanese words for beginners',
            color: '#EA4335', // Google Red
            isPublic: true,
            path: '', // Temporary path, will update after creation
            level: 1,
            userId: firstUser.id,
            languageId: japaneseLanguage.id
        }
    });

    // Cập nhật path cho deck tiếng Nhật
    await prisma.deck.update({
        where: { id: japaneseDeck.id },
        data: { path: `${japaneseDeck.id}` }
    });

    console.log(`Đã tạo deck tiếng Nhật: ${japaneseDeck.name} (ID: ${japaneseDeck.id})`);

    // Tạo các deck con cho tiếng Anh
    const englishSubDecks = [
        {
            name: 'English Grammar',
            description: 'Basic English grammar concepts',
            color: '#34A853', // Google Green
            isPublic: true,
            parentDeckId: englishDeck.id,
            languageId: englishLanguage.id
        },
        {
            name: 'English Phrasal Verbs',
            description: 'Common English phrasal verbs',
            color: '#FBBC05', // Google Yellow
            isPublic: true,
            parentDeckId: englishDeck.id,
            languageId: englishLanguage.id
        }
    ];

    for (const deckData of englishSubDecks) {
        const subDeck = await prisma.deck.create({
            data: {
                ...deckData,
                userId: firstUser.id,
                path: '',
                level: 2
            }
        });

        // Cập nhật path cho deck con
        await prisma.deck.update({
            where: { id: subDeck.id },
            data: { path: `${englishDeck.id}/${subDeck.id}` }
        });

        console.log(`Đã tạo deck con tiếng Anh: ${subDeck.name} (ID: ${subDeck.id})`);
    }

    // Tạo các deck con cho tiếng Nhật
    const japaneseSubDecks = [
        {
            name: 'Hiragana',
            description: 'Basic Japanese Hiragana characters',
            color: '#4285F4', // Google Blue
            isPublic: true,
            parentDeckId: japaneseDeck.id,
            languageId: japaneseLanguage.id
        },
        {
            name: 'Katakana',
            description: 'Basic Japanese Katakana characters',
            color: '#EA4335', // Google Red
            isPublic: true,
            parentDeckId: japaneseDeck.id,
            languageId: japaneseLanguage.id
        }
    ];

    for (const deckData of japaneseSubDecks) {
        const subDeck = await prisma.deck.create({
            data: {
                ...deckData,
                userId: firstUser.id,
                path: '',
                level: 2
            }
        });

        // Cập nhật path cho deck con
        await prisma.deck.update({
            where: { id: subDeck.id },
            data: { path: `${japaneseDeck.id}/${subDeck.id}` }
        });

        console.log(`Đã tạo deck con tiếng Nhật: ${subDeck.name} (ID: ${subDeck.id})`);
    }

    console.log('Hoàn thành seed dữ liệu deck từ vựng!');
}
