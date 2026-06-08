import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const {
      menuId,
      nombrePersonne,
      datePrestation,
      heureLivraison,
      livraison,
      prixLivraison,
      client,
    } = await request.json();

    if (!menuId || !nombrePersonne || !datePrestation || !heureLivraison) {
      return NextResponse.json(
        { message: "Informations de commande incomplètes." },
        { status: 400 },
      );
    }

    if (!client?.email) {
      return NextResponse.json(
        { message: "Utilisateur introuvable. Veuillez vous connecter." },
        { status: 401 },
      );
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: {
        email: client.email,
      },
    });

    if (!utilisateur) {
      return NextResponse.json(
        { message: "Compte utilisateur introuvable." },
        { status: 404 },
      );
    }

    const menu = await prisma.menu.findUnique({
      where: {
        menu_id: Number(menuId),
      },
    });

    if (!menu) {
      return NextResponse.json(
        { message: "Menu introuvable." },
        { status: 404 },
      );
    }

    if (Number(nombrePersonne) < menu.nombre_personne_minimum) {
      return NextResponse.json(
        {
          message: `Ce menu nécessite au minimum ${menu.nombre_personne_minimum} personnes.`,
        },
        { status: 400 },
      );
    }

    if (menu.quantite_restante <= 0) {
      return NextResponse.json(
        { message: "Ce menu n'est plus disponible." },
        { status: 400 },
      );
    }

    const prixMenu = menu.prix_par_personne * Number(nombrePersonne);
    const livraisonPrice = livraison ? Number(prixLivraison || 0) : 0;

    const commande = await prisma.commande.create({
      data: {
        numero_commande: `CMD-${Date.now()}`,
        date_commande: new Date(),
        date_prestation: new Date(datePrestation),
        heure_livraison: heureLivraison,
        prix_menu: prixMenu,
        nombre_personne: Number(nombrePersonne),
        prix_livraison: livraisonPrice,
        statut: "en attente",
        pret_materiel: false,
        restitution_materiel: false,
        utilisateur_id: utilisateur.utilisateur_id,
        menu_id: Number(menuId),
        statusHistory: {
          create: {
            status: "en attente",
          },
        },
      },
    });

    await prisma.menu.update({
      where: {
        menu_id: Number(menuId),
      },
      data: {
        quantite_restante: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({
      message: "Commande créée avec succès.",
      commandeId: commande.commande_id,
      numero: commande.numero_commande,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de la création de la commande." },
      { status: 500 },
    );
  }
}
