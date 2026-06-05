import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const plats = await prisma.plat.findMany({
    include: {
      allergenes: {
        include: {
          allergene: true,
        },
      },
    },
    orderBy: {
      titre_plat: "asc",
    },
  });

  return NextResponse.json(plats);
}

export async function POST(request: Request) {
  const { titre, type, allergeneIds = [] } = await request.json();

  if (!titre || !type) {
    return NextResponse.json(
      { message: "Titre et type obligatoires." },
      { status: 400 },
    );
  }

  const plat = await prisma.plat.create({
    data: {
      titre_plat: titre,
      type,
      allergenes: {
        create: allergeneIds.map((id: number) => ({
          allergene: {
            connect: {
              allergene_id: id,
            },
          },
        })),
      },
    },
    include: {
      allergenes: {
        include: {
          allergene: true,
        },
      },
    },
  });

  return NextResponse.json(plat);
}
