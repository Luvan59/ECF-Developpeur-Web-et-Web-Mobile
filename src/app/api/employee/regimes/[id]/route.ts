import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const regimeId = Number(id);

    const menusUsingRegime = await prisma.menu.count({
      where: {
        regime_id: regimeId,
      },
    });

    if (menusUsingRegime > 0) {
      return NextResponse.json(
        {
          message:
            "Impossible de supprimer ce régime car il est utilisé par un ou plusieurs menus.",
        },
        { status: 400 },
      );
    }

    await prisma.regime.delete({
      where: {
        regime_id: regimeId,
      },
    });

    return NextResponse.json({
      message: "Régime supprimé avec succès.",
    });
  } catch (error) {
    console.error("DELETE REGIME ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de la suppression du régime." },
      { status: 500 },
    );
  }
}
