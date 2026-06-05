import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const themes = await prisma.theme.findMany({
    orderBy: { libelle: "asc" },
  });

  return NextResponse.json(themes);
}

export async function POST(request: Request) {
  const { libelle } = await request.json();

  if (!libelle) {
    return NextResponse.json(
      { message: "Libellé obligatoire." },
      { status: 400 },
    );
  }

  const theme =
    (await prisma.theme.findFirst({ where: { libelle } })) ||
    (await prisma.theme.create({ data: { libelle } }));

  return NextResponse.json(theme);
}
