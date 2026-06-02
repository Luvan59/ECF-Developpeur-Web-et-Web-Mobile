import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.avis.findMany({
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
      orderBy: [
        {
          note: "desc",
        },
        {
          avis_id: "desc",
        },
      ],
      take: 4,
    });

    return NextResponse.json(
      reviews.map((review) => ({
        id: review.avis_id,
        user: `${review.utilisateur.prenom} ${review.utilisateur.nom}`,
        note: review.note,
        comment: review.description,
      })),
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erreur lors du chargement des avis." },
      { status: 500 },
    );
  }
}
