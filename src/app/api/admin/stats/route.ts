import { NextResponse } from "next/server";
import { getMongoDb } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const menuId = searchParams.get("menuId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const match: any = {
      statut: "terminée",
    };

    if (menuId) {
      match.menuId = Number(menuId);
    }

    if (startDate || endDate) {
      match.dateCommande = {};

      if (startDate) {
        match.dateCommande.$gte = new Date(startDate);
      }

      if (endDate) {
        match.dateCommande.$lte = new Date(endDate);
      }
    }

    const db = await getMongoDb();

    const stats = await db
      .collection("order_stats")
      .aggregate([
        { $match: match },
        {
          $group: {
            _id: {
              menuId: "$menuId",
              menuTitre: "$menuTitre",
            },
            nombreCommandes: { $sum: 1 },
            chiffreAffaires: { $sum: "$total" },
          },
        },
        {
          $project: {
            _id: 0,
            menuId: "$_id.menuId",
            menuTitre: "$_id.menuTitre",
            nombreCommandes: 1,
            chiffreAffaires: {
              $round: ["$chiffreAffaires", 2],
            },
          },
        },
        {
          $sort: {
            nombreCommandes: -1,
          },
        },
      ])
      .toArray();

    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET ADMIN STATS ERROR:", error);

    return NextResponse.json(
      {
        message:
          "Erreur statistiques NoSQL. Vérifiez MongoDB et la variable MONGODB_URI.",
      },
      { status: 500 },
    );
  }
}
