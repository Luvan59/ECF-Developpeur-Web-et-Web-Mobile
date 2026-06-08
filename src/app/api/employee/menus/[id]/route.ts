import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const menuId = Number(id);

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

    const menu = await prisma.menu.update({
      where: {
        menu_id: menuId,
      },
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

        await prisma.menuImage.deleteMany({
          where: {
            menu_id: menuId,
            type,
            ordre: index,
          },
        });

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
      message: "Menu modifié avec succès.",
      menuId: menu.menu_id,
    });
  } catch (error) {
    console.error("UPDATE MENU ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de la modification du menu." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const menuId = Number(id);

    if (!menuId) {
      return NextResponse.json({ message: "Menu invalide." }, { status: 400 });
    }

    const commandesActives = await prisma.commande.count({
      where: {
        menu_id: menuId,
        statut: {
          not: "terminée",
        },
      },
    });

    if (commandesActives > 0) {
      return NextResponse.json(
        {
          message:
            "Impossible de supprimer ce menu car il est utilisé dans une commande non terminée.",
        },
        { status: 400 },
      );
    }

    await prisma.menuImage.deleteMany({
      where: {
        menu_id: menuId,
      },
    });

    await prisma.menuPlat.deleteMany({
      where: {
        menu_id: menuId,
      },
    });

    await prisma.menu.delete({
      where: {
        menu_id: menuId,
      },
    });

    return NextResponse.json({
      message: "Menu supprimé avec succès.",
    });
  } catch (error) {
    console.error("DELETE MENU ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de la suppression du menu." },
      { status: 500 },
    );
  }
}
