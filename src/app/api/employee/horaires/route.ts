import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const horaires = await prisma.horaire.findMany({
    orderBy: {
      horaire_id: "asc",
    },
  });

  return NextResponse.json(
    horaires.map((horaire) => ({
      id: horaire.horaire_id,
      jour: horaire.jour,
      ouverture: horaire.heure_ouverture,
      fermeture: horaire.heure_fermeture,
    })),
  );
}

export async function POST(request: Request) {
  try {
    const { jour, ouverture, fermeture } = await request.json();

    if (!jour || !ouverture || !fermeture) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires." },
        { status: 400 },
      );
    }

    const horaire = await prisma.horaire.create({
      data: {
        jour,
        heure_ouverture: ouverture,
        heure_fermeture: fermeture,
      },
    });

    return NextResponse.json({
      message: "Horaire créé avec succès.",
      horaire: {
        id: horaire.horaire_id,
        jour: horaire.jour,
        ouverture: horaire.heure_ouverture,
        fermeture: horaire.heure_fermeture,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Erreur lors de la création de l'horaire." },
      { status: 500 },
    );
  }
}
