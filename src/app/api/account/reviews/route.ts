import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Utilisateur non connecté." },
        { status: 401 },
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const userId = Number(payload.id);

    const { commandeId, note, commentaire } = await request.json();

    if (!commandeId || !note || !commentaire) {
      return NextResponse.json(
        { message: "La note et le commentaire sont obligatoires." },
        { status: 400 },
      );
    }

    if (note < 1 || note > 5) {
      return NextResponse.json(
        { message: "La note doit être comprise entre 1 et 5." },
        { status: 400 },
      );
    }

    const commande = await prisma.commande.findUnique({
      where: {
        commande_id: Number(commandeId),
      },
    });

    if (!commande || commande.utilisateur_id !== userId) {
      return NextResponse.json(
        { message: "Commande introuvable." },
        { status: 404 },
      );
    }

    if (commande.statut !== "terminée") {
      return NextResponse.json(
        {
          message:
            "Vous pouvez donner un avis uniquement sur une commande terminée.",
        },
        { status: 400 },
      );
    }

    await prisma.avis.create({
      data: {
        note: Number(note),
        description: commentaire,
        statut: "en attente",
        utilisateur_id: userId,
      },
    });

    return NextResponse.json({
      message: "Avis envoyé avec succès. Il sera visible après validation.",
    });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de l'envoi de l'avis." },
      { status: 500 },
    );
  }
}
