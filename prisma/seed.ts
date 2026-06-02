import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.utilisateur.findFirst();

  if (!user) {
    throw new Error("Aucun utilisateur trouvé. Crée d'abord un compte.");
  }

  await prisma.orderStatusHistory.deleteMany();
  await prisma.commande.deleteMany();
  await prisma.menu.deleteMany();

  const theme =
    (await prisma.theme.findFirst({
      where: { libelle: "Classique" },
    })) ||
    (await prisma.theme.create({
      data: { libelle: "Classique" },
    }));

  const regimeClassique =
    (await prisma.regime.findFirst({
      where: { libelle: "Classique" },
    })) ||
    (await prisma.regime.create({
      data: { libelle: "Classique" },
    }));

  const regimeVegan =
    (await prisma.regime.findFirst({
      where: { libelle: "Vegan" },
    })) ||
    (await prisma.regime.create({
      data: { libelle: "Vegan" },
    }));

  const menuMariage = await prisma.menu.create({
    data: {
      titre: "Menu Mariage Prestige",
      nombre_personne_minimum: 50,
      prix_par_personne: 30,
      regime: "Classique",
      description:
        "Cocktail de bienvenue, entrée gastronomique, plat au choix et dessert.",
      quantite_restante: 5,
      theme_id: theme.theme_id,
      regime_id: regimeClassique.regime_id,
    },
  });

  const menuNoel = await prisma.menu.create({
    data: {
      titre: "Menu Noël Entreprise",
      nombre_personne_minimum: 40,
      prix_par_personne: 35,
      regime: "Classique",
      description:
        "Repas festif comprenant entrée, plat de fête et dessert de Noël.",
      quantite_restante: 8,
      theme_id: theme.theme_id,
      regime_id: regimeClassique.regime_id,
    },
  });

  const menuVegan = await prisma.menu.create({
    data: {
      titre: "Menu Vegan",
      nombre_personne_minimum: 15,
      prix_par_personne: 24,
      regime: "Vegan",
      description:
        "Menu végétal composé de produits frais, locaux et de saison.",
      quantite_restante: 10,
      theme_id: theme.theme_id,
      regime_id: regimeVegan.regime_id,
    },
  });

  const commande1 = await prisma.commande.create({
    data: {
      numero_commande: "CMD-2026-001",
      date_commande: new Date(),
      date_prestation: new Date("2026-06-15"),
      heure_livraison: "12:00",
      prix_menu: 3600,
      nombre_personne: 120,
      prix_livraison: 0,
      statut: "terminée",
      pret_materiel: false,
      restitution_materiel: false,
      utilisateur_id: user.utilisateur_id,
      menu_id: menuMariage.menu_id,
    },
  });

  await prisma.orderStatusHistory.createMany({
    data: [
      { orderId: commande1.commande_id, status: "Commande créée" },
      { orderId: commande1.commande_id, status: "Commande acceptée" },
      { orderId: commande1.commande_id, status: "En préparation" },
      { orderId: commande1.commande_id, status: "Livrée" },
      { orderId: commande1.commande_id, status: "Terminée" },
    ],
  });

  const commande2 = await prisma.commande.create({
    data: {
      numero_commande: "CMD-2026-002",
      date_commande: new Date(),
      date_prestation: new Date("2026-07-20"),
      heure_livraison: "19:00",
      prix_menu: 980,
      nombre_personne: 35,
      prix_livraison: 25,
      statut: "accepté",
      pret_materiel: false,
      restitution_materiel: false,
      utilisateur_id: user.utilisateur_id,
      menu_id: menuNoel.menu_id,
    },
  });

  await prisma.orderStatusHistory.createMany({
    data: [
      { orderId: commande2.commande_id, status: "Commande créée" },
      { orderId: commande2.commande_id, status: "Commande acceptée" },
    ],
  });

  const commande3 = await prisma.commande.create({
    data: {
      numero_commande: "CMD-2026-003",
      date_commande: new Date(),
      date_prestation: new Date("2026-12-18"),
      heure_livraison: "20:00",
      prix_menu: 2250,
      nombre_personne: 80,
      prix_livraison: 0,
      statut: "en attente",
      pret_materiel: true,
      restitution_materiel: false,
      utilisateur_id: user.utilisateur_id,
      menu_id: menuVegan.menu_id,
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId: commande3.commande_id,
      status: "Commande créée",
    },
  });

  console.log("Menus, commandes et historiques créés avec succès.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
