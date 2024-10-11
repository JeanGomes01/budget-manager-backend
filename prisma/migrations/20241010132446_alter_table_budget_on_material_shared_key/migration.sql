/*
  Warnings:

  - You are about to drop the column `budgetId` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the `BudgetMaterial` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BudgetMaterial" DROP CONSTRAINT "BudgetMaterial_budgetId_fkey";

-- DropForeignKey
ALTER TABLE "BudgetMaterial" DROP CONSTRAINT "BudgetMaterial_materialId_fkey";

-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_budgetId_fkey";

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "budgetId";

-- DropTable
DROP TABLE "BudgetMaterial";

-- CreateTable
CREATE TABLE "BudgetOnMaterial" (
    "budgetId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "priceAtCreation" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BudgetOnMaterial_pkey" PRIMARY KEY ("budgetId","materialId")
);

-- AddForeignKey
ALTER TABLE "BudgetOnMaterial" ADD CONSTRAINT "BudgetOnMaterial_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetOnMaterial" ADD CONSTRAINT "BudgetOnMaterial_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
