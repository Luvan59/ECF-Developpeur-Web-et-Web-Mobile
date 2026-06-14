import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin123!", 10);

  await prisma.role.upsert({
    where: { role_id: 1 },
    update: { libelle: "USER" },
    create: {
      role_id: 1,
      libelle: "USER",
    },
  });

  await prisma.role.upsert({
    where: { role_id: 2 },
    update: { libelle: "EMPLOYEE" },
    create: {
      role_id: 2,
      libelle: "EMPLOYEE",
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { role_id: 3 },
    update: { libelle: "ADMIN" },
    create: {
      role_id: 3,
      libelle: "ADMIN",
    },
  });

  await prisma.utilisateur.upsert({
    where: {
      email: "admin@vitegourmand.fr",
    },
    update: {
      password: hashedPassword,
      prenom: "Julie",
      nom: "Admin",
      telephone: "0000000000",
      ville: "Bordeaux",
      pays: "France",
      adresse_postale: "Adresse administrateur",
      actif: true,
      role_id: adminRole.role_id,
    },
    create: {
      email: "admin@vitegourmand.fr",
      password: hashedPassword,
      prenom: "Julie",
      nom: "AdminAdmin",
      telephone: "0000000000",
      ville: "Bordeaux",
      pays: "France",
      adresse_postale: "Adresse administrateur",
      actif: true,
      role_id: adminRole.role_id,
    },
  });

  console.log("Seed terminé.");
  console.log("Admin créé : admin@vitegourmand.fr");
  console.log("Mot de passe : Admin123!");
}

main()
  .catch((error) => {
    console.error("Erreur pendant le seed :", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
