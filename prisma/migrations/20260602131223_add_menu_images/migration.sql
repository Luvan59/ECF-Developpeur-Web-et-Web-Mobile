-- CreateTable
CREATE TABLE "MenuImage" (
    "image_id" SERIAL NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "ordre" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,

    CONSTRAINT "MenuImage_pkey" PRIMARY KEY ("image_id")
);

-- AddForeignKey
ALTER TABLE "MenuImage" ADD CONSTRAINT "MenuImage_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE;
