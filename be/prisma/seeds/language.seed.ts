import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedLanguages() {
    console.log('Bắt đầu seed dữ liệu ngôn ngữ...');

    // Mảng chứa thông tin các ngôn ngữ cần tạo
    const languages = [
        {
            code: 'en',
            name: 'English',
            isRtl: false,
            hasKanji: false
        },
        {
            code: 'ja',
            name: 'Japanese',
            isRtl: false,
            hasKanji: true
        }
    ];

    for (const language of languages) {
        // Kiểm tra xem ngôn ngữ đã tồn tại chưa
        const existingLanguage = await prisma.language.findUnique({
            where: { code: language.code }
        });

        if (existingLanguage) {
            console.log(`Ngôn ngữ ${language.name} (${language.code}) đã tồn tại.`);
            continue;
        }

        // Tạo ngôn ngữ mới
        await prisma.language.create({
            data: language
        });

        console.log(`Đã tạo thành công ngôn ngữ: ${language.name} (${language.code})`);
    }

    console.log('Hoàn thành seed dữ liệu ngôn ngữ!');
}
