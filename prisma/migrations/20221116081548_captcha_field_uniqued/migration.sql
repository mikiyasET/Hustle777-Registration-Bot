/*
  Warnings:

  - A unique constraint covering the columns `[captcha]` on the table `captcha` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `captcha_captcha_key` ON `captcha`(`captcha`);
