-- CreateTable
CREATE TABLE `Book` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `coverUrl` VARCHAR(191) NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileFormat` VARCHAR(191) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `pageCount` INTEGER NULL,
    `contentHash` VARCHAR(191) NULL,
    `uploadDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastOpened` DATETIME(3) NULL,
    `readingPage` INTEGER NULL,
    `tags` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
