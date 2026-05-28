import { PrismaClient } from "@prisma/client";
import { fakerFR as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const role = await prisma.role.create({
    data: {
      libelle: "USER",
    },
  });

  for (let i = 0; i < 10; i++) {
    await prisma.utilisateur.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        prenom: faker.person.firstName(),
        telephone: faker.phone.number(),
        ville: faker.location.city(),
        pays: "France",
        adresse_postale: faker.location.streetAddress(),

        role_id: role.role_id,
      },
    });
  }

  console.log("FAKE DATA CREATED");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
