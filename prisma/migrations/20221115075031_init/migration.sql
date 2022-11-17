-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `username` VARCHAR(100) NULL,
    `password` VARCHAR(255) NULL,
    `user_id` INTEGER NULL,

    UNIQUE INDEX `unq_admin_name`(`name`),
    UNIQUE INDEX `unq_admin_username`(`username`),
    UNIQUE INDEX `admin_user_id_key`(`user_id`),
    INDEX `fk_admin_users`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tg_id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(100) NULL,
    `fname` VARCHAR(100) NULL,
    `lname` VARCHAR(100) NULL,
    `status` ENUM('UNACTIVE', 'ACTIVE', 'BANNED') NOT NULL DEFAULT 'ACTIVE',

    UNIQUE INDEX `telegramUsers_tg_id_key`(`tg_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `botTalkers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `current` VARCHAR(100) NULL,
    `previous` VARCHAR(255) NULL,
    `waiting` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `botTalkers_tid_key`(`user_id`),
    INDEX `fk_tg_user_talking`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `promoCode` VARCHAR(100) NULL,
    `user_id` INTEGER NULL,
    `status` ENUM('UNACTIVE', 'ACTIVE', 'BANNED') NOT NULL DEFAULT 'UNACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `accounts_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin` ADD CONSTRAINT `fk_admin_users` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `botTalkers` ADD CONSTRAINT `botTalkers_tid_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `fk_accounts_users` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requests` ADD CONSTRAINT `fk_requests_accounts` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
