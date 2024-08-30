-- AlterTable
ALTER TABLE "ProductImage" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductSpecification" ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "updated_at" DROP NOT NULL;
