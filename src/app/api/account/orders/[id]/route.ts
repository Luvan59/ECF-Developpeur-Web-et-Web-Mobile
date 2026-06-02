import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
    const { id } = await params;
    const orderId = Number(id);

    const order = await prisma.commande.findUnique({
      where: { commande_id: orderId },
    });

    if (!order || order.utilisateur_id !== userId) {
      return NextResponse.json(
        { message: "Commande introuvable." },
        { status: 404 },
      );
    }

    if (order.statut !== "en attente") {
      return NextResponse.json(
        { message: "Cette commande ne peut plus être annulée." },
        { status: 400 },
      );
    }

    await prisma.commande.delete({
      where: { commande_id: orderId },
    });

    return NextResponse.json({
      message: "Commande supprimée avec succès.",
    });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de la suppression." },
      { status: 500 },
    );
  }
}
