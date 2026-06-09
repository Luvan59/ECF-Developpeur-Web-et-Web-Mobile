import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderFinishedEmail } from "@/lib/mail";
import { getMongoDb } from "@/lib/mongodb";

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

const allowedStatuses = [
  "accepté",
  "en préparation",
  "en cours de livraison",
  "livré",
  "en attente du retour de matériel",
  "terminée",
];

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const orderId = Number(id);

    const { statut } = await request.json();

    if (!allowedStatuses.includes(statut)) {
      return NextResponse.json(
        { message: "Statut invalide." },
        { status: 400 },
      );
    }

    const oldCommande = await prisma.commande.findUnique({
      where: {
        commande_id: orderId,
      },
      include: {
        utilisateur: true,
      },
    });

    if (!oldCommande) {
      return NextResponse.json(
        { message: "Commande introuvable." },
        { status: 404 },
      );
    }

    const commande = await prisma.commande.update({
      where: {
        commande_id: orderId,
      },
      data: {
        statut,
        statusHistory: {
          create: {
            status: statut,
          },
        },
      },
      include: {
        utilisateur: true,
        menu: true,
      },
    });

    const mongoDb = await getMongoDb();

    if (statut === "terminée") {
      await mongoDb.collection("order_stats").updateOne(
        {
          commandeId: commande.commande_id,
        },
        {
          $set: {
            commandeId: commande.commande_id,
            numeroCommande: commande.numero_commande,

            menuId: commande.menu.menu_id,
            menuTitre: commande.menu.titre,

            utilisateurId: commande.utilisateur.utilisateur_id,
            client: `${commande.utilisateur.prenom} ${commande.utilisateur.nom}`,

            nombrePersonne: commande.nombre_personne,
            prixMenu: commande.prix_menu,
            prixLivraison: commande.prix_livraison,
            total: commande.prix_menu + commande.prix_livraison,

            statut: commande.statut,
            dateCommande: commande.date_commande,
            datePrestation: commande.date_prestation,
            dateTerminee: new Date(),
          },
        },
        {
          upsert: true,
        },
      );
    } else {
      await mongoDb.collection("order_stats").deleteOne({
        commandeId: commande.commande_id,
      });
    }

    if (statut === "terminée" && oldCommande.statut !== "terminée") {
      try {
        await sendOrderFinishedEmail({
          to: commande.utilisateur.email,
          prenom: commande.utilisateur.prenom,
          numeroCommande: commande.numero_commande,
        });
      } catch (mailError) {
        console.error("SEND ORDER FINISHED EMAIL ERROR:", mailError);

        return NextResponse.json({
          message:
            "Statut mis à jour, mais le mail de notification n'a pas pu être envoyé.",
          order: {
            id: commande.commande_id,
            numero: commande.numero_commande,
            client: `${commande.utilisateur.prenom} ${commande.utilisateur.nom}`,
            email: commande.utilisateur.email,
            telephone: commande.utilisateur.telephone,
            menu: commande.menu.titre,
            date: new Date(commande.date_prestation).toLocaleDateString(
              "fr-FR",
            ),
            heure: commande.heure_livraison,
            total: `${commande.prix_menu + commande.prix_livraison} €`,
            statut: commande.statut,
            materiel: commande.pret_materiel,
          },
        });
      }
    }

    return NextResponse.json({
      message:
        statut === "terminée"
          ? "Commande terminée. Le client a été notifié par mail."
          : "Statut de commande mis à jour.",
      order: {
        id: commande.commande_id,
        numero: commande.numero_commande,
        client: `${commande.utilisateur.prenom} ${commande.utilisateur.nom}`,
        email: commande.utilisateur.email,
        telephone: commande.utilisateur.telephone,
        menu: commande.menu.titre,
        date: new Date(commande.date_prestation).toLocaleDateString("fr-FR"),
        heure: commande.heure_livraison,
        total: `${commande.prix_menu + commande.prix_livraison} €`,
        statut: commande.statut,
        materiel: commande.pret_materiel,
      },
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de la modification du statut." },
      { status: 500 },
    );
  }
}
