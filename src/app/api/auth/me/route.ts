import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Non connecté" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const user = await prisma.utilisateur.findUnique({
      where: {
        utilisateur_id: Number(payload.id),
      },
      select: {
        utilisateur_id: true,
        email: true,
        prenom: true,
        nom: true,
        telephone: true,
        adresse_postale: true,
        ville: true,
        pays: true,
        role: {
          select: {
            libelle: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur introuvable." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: user.utilisateur_id,
      email: user.email,
      prenom: user.prenom,
      nom: user.nom,
      telephone: user.telephone,
      adresse: user.adresse_postale,
      ville: user.ville,
      pays: user.pays,
      role: user.role.libelle,
    });
  } catch {
    return NextResponse.json({ message: "Session invalide" }, { status: 401 });
  }
}
