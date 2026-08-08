-- CreateTable
CREATE TABLE "Palette" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "colors" TEXT[],

    CONSTRAINT "Palette_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Palette" ADD CONSTRAINT "Palette_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
