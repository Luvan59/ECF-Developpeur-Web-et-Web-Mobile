import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const orderId = Number(id);

    const { contactMode, cancelReason } = await request.json();

    if (!contactMode || !cancelReason) {
      return NextResponse.json(
        { message: "Le mode de contact et le motif sont obligatoires." },
        { status: 400 },
      );
    }

    await prisma.commande.delete({
      where: {
        commande_id: orderId,
      },
    });

    return NextResponse.json({
      message: "Commande annulée et supprimée avec succès.",
    });
  } catch (error) {
    console.error("DELETE EMPLOYEE ORDER ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de la suppression de la commande." },
      { status: 500 },
    );
  }
}
