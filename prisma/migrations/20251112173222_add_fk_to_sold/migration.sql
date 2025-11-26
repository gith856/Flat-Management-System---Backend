-- DropIndex
DROP INDEX `enquiries_buyer_id_fkey` ON `enquiries`;

-- DropIndex
DROP INDEX `enquiries_flat_id_fkey` ON `enquiries`;

-- DropIndex
DROP INDEX `enquiries_seller_id_fkey` ON `enquiries`;

-- DropIndex
DROP INDEX `flats_user_id_fkey` ON `flats`;

-- AddForeignKey
ALTER TABLE `flats` ADD CONSTRAINT `flats_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `flats` ADD CONSTRAINT `flats_sold_to_user_id_fkey` FOREIGN KEY (`sold_to_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enquiries` ADD CONSTRAINT `enquiries_flat_id_fkey` FOREIGN KEY (`flat_id`) REFERENCES `flats`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enquiries` ADD CONSTRAINT `enquiries_buyer_id_fkey` FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enquiries` ADD CONSTRAINT `enquiries_seller_id_fkey` FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
