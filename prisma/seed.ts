import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = "Admin123!";
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  const userRole = await prisma.role.upsert({
    where: {
      role_id: 1,
    },
    update: {
      libelle: "USER",
    },
    create: {
      role_id: 1,
      libelle: "USER",
    },
  });

  const employeeRole = await prisma.role.upsert({
    where: {
      role_id: 2,
    },
    update: {
      libelle: "EMPLOYEE",
    },
    create: {
      role_id: 2,
      libelle: "EMPLOYEE",
    },
  });

  const adminRole = await prisma.role.upsert({
    where: {
      role_id: 3,
    },
    update: {
      libelle: "ADMIN",
    },
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
      password: hashedAdminPassword,
      prenom: ".",
      nom: ".",
      telephone: "0000000000",
      ville: "Bordeaux",
      pays: "France",
      adresse_postale: "Adresse administrateur",
      actif: true,
      role_id: adminRole.role_id,
    },
    create: {
      email: "Lucasvanhoute07@gmail.com",
      password: hashedAdminPassword,
      prenom: ".",
      nom: ".",
      telephone: "0000000000",
      ville: "Bordeaux",
      pays: "France",
      adresse_postale: "Adresse administrateur",
      actif: true,
      role_id: adminRole.role_id,
    },
  });

  console.log("Seed terminé avec succès.");
  console.log("Rôles créés :", {
    user: userRole.libelle,
    employee: employeeRole.libelle,
    admin: adminRole.libelle,
  });
}

main()
  .catch((error) => {
    console.error("Erreur seed :", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });