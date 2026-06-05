import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const avis = await prisma.avis.findMany({
      include: {
        utilisateur: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      avis.map((avis) => ({
        id: avis.avis_id,
        note: avis.note,
        description: avis.description,
        statut: avis.statut,
        dateCreation: avis.createdAt,
        client: `${avis.utilisateur.prenom} ${avis.utilisateur.nom}`,
        email: avis.utilisateur.email,
      })),
    );
  } catch (error) {
    console.error("GET EMPLOYEE REVIEWS ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors du chargement des avis." },
      { status: 500 },
    );
  }
}
