import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const allergenes = await prisma.allergene.findMany({
    orderBy: { libelle: "asc" },
  });

  return NextResponse.json(allergenes);
}

export async function POST(request: Request) {
  const { libelle } = await request.json();

  if (!libelle) {
    return NextResponse.json({ message: "Libellé obligatoire." }, { status: 400 });
  }

  const allergene =
    (await prisma.allergene.findFirst({ where: { libelle } })) ||
    (await prisma.allergene.create({ data: { libelle } }));

  return NextResponse.json(allergene);
}