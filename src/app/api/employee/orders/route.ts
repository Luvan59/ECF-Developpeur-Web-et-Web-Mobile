import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const commandes = await prisma.commande.findMany({
    include: {
      utilisateur: true,
      menu: true,
    },
    orderBy: {
      date_commande: "desc",
    },
  });

  return NextResponse.json(
    commandes.map((commande) => ({
      id: commande.commande_id,
      numero: commande.numero_commande,
      client: `${commande.utilisateur.prenom} ${commande.utilisateur.nom}`,
      email: commande.utilisateur.email,
      telephone: commande.utilisateur.telephone,
      menu: commande.menu.titre,
      date: commande.date_prestation.toLocaleDateString("fr-FR"),
      heure: commande.heure_livraison,
      statut: commande.statut,
      total: `${commande.prix_menu + commande.prix_livraison} €`,
      materiel: commande.pret_materiel,
    })),
  );
}
