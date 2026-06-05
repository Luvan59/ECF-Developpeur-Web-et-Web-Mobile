import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const avisId = Number(id);

    const { statut } = await request.json();

    if (!["validé", "refusé"].includes(statut)) {
      return NextResponse.json(
        { message: "Statut invalide." },
        { status: 400 },
      );
    }

    const avis = await prisma.avis.update({
      where: {
        avis_id: avisId,
      },
      data: {
        statut,
      },
      include: {
        utilisateur: true,
      },
    });

    return NextResponse.json({
      message:
        statut === "validé"
          ? "Avis validé avec succès."
          : "Avis refusé avec succès.",
      avis: {
        id: avis.avis_id,
        note: avis.note,
        description: avis.description,
        statut: avis.statut,
        client: `${avis.utilisateur.prenom} ${avis.utilisateur.nom}`,
        email: avis.utilisateur.email,
      },
    });
  } catch (error) {
    console.error("UPDATE EMPLOYEE REVIEW ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de la mise à jour de l'avis." },
      { status: 500 },
    );
  }
}
