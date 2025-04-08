import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

async function main() {
    // Xóa dữ liệu hiện có (nếu cần)
    // Bỏ comment nếu muốn xóa dữ liệu cũ trước khi seed
    // await prisma.refreshToken.deleteMany({});
    // await prisma.user.deleteMany({});

    // Kiểm tra xem user đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
        where: {
            email: 'kien2572001.ntk@gmail.com',
        },
    });

    if (existingUser) {
        console.log('User đã tồn tại:', existingUser.email);
        return;
    }

    // Tạo người dùng với thông tin yêu cầu
    const password = await hashPassword('123456');
    const user = await prisma.user.create({
        data: {
            email: 'kien2572001.ntk@gmail.com',
            password: password,
            name: 'Kien Nguyen',
            role: 'user',
        },
    });

    console.log('Đã tạo thành công tài khoản user:', user.email);
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
