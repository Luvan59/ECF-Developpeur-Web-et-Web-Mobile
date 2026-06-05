import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const menuId = Number(id);

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
            "Impossible de supprimer ce menu car il est utilisé dans une ou plusieurs commandes non terminées.",
        },
        { status: 400 },
      );
    }

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
