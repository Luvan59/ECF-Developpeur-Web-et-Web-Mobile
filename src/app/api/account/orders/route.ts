import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

    const commandes = await prisma.commande.findMany({
      where: {
        utilisateur_id: userId,
      },
      include: {
        menu: true,
        statusHistory: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        date_commande: "desc",
      },
    });

    return NextResponse.json(
      commandes.map((commande) => ({
        id: commande.commande_id,
        numero: commande.numero_commande,
        menu: commande.menu.titre,
        date: commande.date_prestation.toLocaleDateString("fr-FR"),
        heure: commande.heure_livraison,
        personnes: commande.nombre_personne,
        statut: commande.statut,
        total: `${commande.prix_menu + commande.prix_livraison} €`,
        prixMenu: `${commande.prix_menu} €`,
        prixLivraison: `${commande.prix_livraison} €`,
        pretMateriel: commande.pret_materiel,
        restitutionMateriel: commande.restitution_materiel,
        suivi: commande.statusHistory.map((history) => ({
          status: history.status,
          date: history.createdAt.toLocaleDateString("fr-FR"),
          heure: history.createdAt.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })),
      })),
    );
  } catch (error) {
    console.error("ACCOUNT ORDERS ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors du chargement des commandes." },
      { status: 500 },
    );
  }
}
