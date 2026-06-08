import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        theme: true,
        regimeRelation: true,
        images: {
          orderBy: {
            ordre: "asc",
          },
        },
        plats: {
          include: {
            plat: {
              include: {
                allergenes: {
                  include: {
                    allergene: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        menu_id: "desc",
      },
    });

    return NextResponse.json(
      menus.map((menu) => {
        const entree = menu.plats.find(
          (menuPlat) => menuPlat.plat.type === "entree",
        )?.plat;

        const platPrincipal = menu.plats.find(
          (menuPlat) => menuPlat.plat.type === "plat",
        )?.plat;

        const dessert = menu.plats.find(
          (menuPlat) => menuPlat.plat.type === "dessert",
        )?.plat;

        const allergens = menu.plats.flatMap((menuPlat) =>
          menuPlat.plat.allergenes.map(
            (platAllergene) => platAllergene.allergene.libelle,
          ),
        );

        const uniqueAllergens = [...new Set(allergens)];

        return {
          id: menu.menu_id,
          title: menu.titre,
          description: menu.description,
          price: menu.prix_par_personne,
          minPeople: menu.nombre_personne_minimum,
          theme: menu.theme.libelle,
          regime: menu.regimeRelation.libelle,
          conditions: "Conditions à définir",
          stock: menu.quantite_restante,

          presentationImages: menu.images
            .filter((image) => image.type === "presentation")
            .map((image) => image.url),

          images: menu.images
            .filter((image) => image.type === "detail")
            .map((image) => image.url),

          dishes: {
            starter: entree?.titre_plat || "Non renseigné",
            main: platPrincipal?.titre_plat || "Non renseigné",
            dessert: dessert?.titre_plat || "Non renseigné",
          },

          allergens: uniqueAllergens,
        };
      }),
    );
  } catch (error) {
    console.error("GET PUBLIC MENUS ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors du chargement des menus." },
      { status: 500 },
    );
  }
}
