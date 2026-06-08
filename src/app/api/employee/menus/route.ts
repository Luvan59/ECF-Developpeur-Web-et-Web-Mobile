import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        theme: true,
        regimeRelation: true,
        images: {
          orderBy: {
            ordre: "asc",
          },
        },
      },
      orderBy: {
        menu_id: "desc",
      },
    });

    return NextResponse.json(
      menus.map((menu) => ({
        id: menu.menu_id,
        titre: menu.titre,
        theme: menu.theme.libelle,
        regime: menu.regimeRelation.libelle,
        prix: menu.prix_par_personne,
        minimum: menu.nombre_personne_minimum,
        stock: menu.quantite_restante,
        description: menu.description,
        presentationImages: menu.images
          .filter((image) => image.type === "presentation")
          .map((image) => ({ url: image.url })),
        detailImages: menu.images
          .filter((image) => image.type === "detail")
          .map((image) => ({ url: image.url })),
      })),
    );
  } catch (error) {
    console.error("GET MENUS ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors du chargement des menus." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const titre = String(formData.get("titre"));
    const theme = String(formData.get("theme"));
    const regime = String(formData.get("regime"));
    const prix = Number(formData.get("prix"));
    const minimum = Number(formData.get("minimum"));
    const stock = Number(formData.get("stock"));
    const description = String(formData.get("description"));

    const themeRecord =
      (await prisma.theme.findFirst({ where: { libelle: theme } })) ||
      (await prisma.theme.create({ data: { libelle: theme } }));

    const regimeRecord =
      (await prisma.regime.findFirst({ where: { libelle: regime } })) ||
      (await prisma.regime.create({ data: { libelle: regime } }));

    const menu = await prisma.menu.create({
      data: {
        titre,
        nombre_personne_minimum: minimum,
        prix_par_personne: prix,
        regime,
        description,
        quantite_restante: stock,
        theme_id: themeRecord.theme_id,
        regime_id: regimeRecord.regime_id,
      },
    });

    const uploadDir = path.join(process.cwd(), "public/uploads/menus");
    await mkdir(uploadDir, { recursive: true });

    const saveImages = async (prefix: string, type: string, max: number) => {
      for (let index = 0; index < max; index++) {
        const file = formData.get(`${prefix}_${index}`) as File | null;

        if (!file || file.size === 0) continue;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `${Date.now()}-${type}-${index}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        await prisma.menuImage.create({
          data: {
            url: `/uploads/menus/${fileName}`,
            type,
            ordre: index,
            menu_id: menu.menu_id,
          },
        });
      }
    };

    await saveImages("presentationImage", "presentation", 4);
    await saveImages("detailImage", "detail", 6);

    return NextResponse.json({
      message: "Menu créé avec succès.",
      menuId: menu.menu_id,
    });
  } catch (error) {
    console.error("CREATE MENU ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de la création du menu." },
      { status: 500 },
    );
  }
}
