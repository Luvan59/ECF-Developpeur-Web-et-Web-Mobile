import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const regimes = await prisma.regime.findMany({
    orderBy: {
      libelle: "asc",
    },
  });

  return NextResponse.json(regimes);
}

export async function POST(request: Request) {
  const { libelle } = await request.json();

  if (!libelle) {
    return NextResponse.json(
      { message: "Libellé obligatoire." },
      { status: 400 },
    );
  }

  const existingRegime = await prisma.regime.findFirst({
    where: {
      libelle,
    },
  });

  if (existingRegime) {
    return NextResponse.json(existingRegime);
  }

  const regime = await prisma.regime.create({
    data: {
      libelle,
    },
  });

  return NextResponse.json(regime);
}
