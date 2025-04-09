import { PrismaClient } from '@prisma/client';
import { seedUsers } from './user.seed';
import { seedLanguages } from './language.seed';

const prisma = new PrismaClient();

async function main() {
    // Chạy các hàm seed theo thứ tự
    await seedUsers();
    await seedLanguages();
}

main()
    .catch((e) => {
        console.error('Lỗi khi seed dữ liệu:', e);
        process.exit(1);
    })
    .finally(async () => {
        // Đóng kết nối Prisma khi hoàn thành
        await prisma.$disconnect();
    });
