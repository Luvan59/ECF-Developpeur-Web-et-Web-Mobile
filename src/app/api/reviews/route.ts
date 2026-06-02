import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const avis = await prisma.avis.findMany({
      where: {
        statut: "validé",
      },
      include: {
        utilisateur: {
          select: {
            prenom: true,
            nom: true,
          },
        },
      },
      orderBy: {
        avis_id: "desc",
      },
    });

    return NextResponse.json(
      avis.map((item) => ({
        id: item.avis_id,
        note: item.note,
        commentaire: item.description,
        statut: item.statut,
        auteur: `${item.utilisateur.prenom} ${item.utilisateur.nom}`,
      })),
    );
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors du chargement des avis." },
      { status: 500 },
    );
  }
}
