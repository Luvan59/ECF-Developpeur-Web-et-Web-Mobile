import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const horaireId = Number(id);

    const { jour, ouverture, fermeture } = await request.json();

    if (!jour || !ouverture || !fermeture) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires." },
        { status: 400 },
      );
    }

    const horaire = await prisma.horaire.update({
      where: {
        horaire_id: horaireId,
      },
      data: {
        jour,
        heure_ouverture: ouverture,
        heure_fermeture: fermeture,
      },
    });

    return NextResponse.json({
      message: "Horaire modifié avec succès.",
      horaire: {
        id: horaire.horaire_id,
        jour: horaire.jour,
        ouverture: horaire.heure_ouverture,
        fermeture: horaire.heure_fermeture,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Erreur lors de la modification de l'horaire." },
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
    const horaireId = Number(id);

    await prisma.horaire.delete({
      where: {
        horaire_id: horaireId,
      },
    });

    return NextResponse.json({
      message: "Horaire supprimé avec succès.",
    });
  } catch (error) {
    console.error("DELETE HORAIRE ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de la suppression de l'horaire." },
      { status: 500 },
    );
  }
}
