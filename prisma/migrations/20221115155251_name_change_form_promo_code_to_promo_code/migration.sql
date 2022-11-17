/*
  Warnings:

  - You are about to drop the column `promoCode` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `accounts` DROP COLUMN `promoCode`,
    ADD COLUMN `promo_code` VARCHAR(100) NULL;
