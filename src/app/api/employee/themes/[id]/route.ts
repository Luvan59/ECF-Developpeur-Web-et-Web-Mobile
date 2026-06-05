import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const themeId = Number(id);

    const menusUsingTheme = await prisma.menu.count({
      where: {
        theme_id: themeId,
      },
    });

    if (menusUsingTheme > 0) {
      return NextResponse.json(
        {
          message:
            "Impossible de supprimer ce thème car il est utilisé par un ou plusieurs menus.",
        },
        { status: 400 },
      );
    }

    await prisma.theme.delete({
      where: {
        theme_id: themeId,
      },
    });

    return NextResponse.json({
      message: "Thème supprimé avec succès.",
    });
  } catch (error) {
    console.error("DELETE THEME ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de la suppression du thème." },
      { status: 500 },
    );
  }
}
