-- AlterEnum
ALTER TYPE "public"."CommentStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "public"."comments" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "moderationNote" TEXT;
