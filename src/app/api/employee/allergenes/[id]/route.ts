import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const allergeneId = Number(id);

    const platsUsingAllergene = await prisma.platAllergene.count({
      where: {
        allergene_id: allergeneId,
      },
    });

    if (platsUsingAllergene > 0) {
      return NextResponse.json(
        {
          message:
            "Impossible de supprimer cet allergène car il est utilisé par un ou plusieurs plats.",
        },
        { status: 400 },
      );
    }

    await prisma.allergene.delete({
      where: {
        allergene_id: allergeneId,
      },
    });

    return NextResponse.json({
      message: "Allergène supprimé avec succès.",
    });
  } catch (error) {
    console.error("DELETE ALLERGENE ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de la suppression de l'allergène." },
      { status: 500 },
    );
  }
}
