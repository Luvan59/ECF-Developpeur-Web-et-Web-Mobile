import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      email,
      password,
      prenom,
      nom,
      telephone,
      ville,
      pays,
      adresse_postale,
    } = body;

    if (
      !email ||
      !password ||
      !prenom ||
      !nom ||
      !telephone ||
      !ville ||
      !pays ||
      !adresse_postale
    ) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          message: "Adresse email invalide.",
        },
        { status: 400 },
      );
    }

    const existingUser = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Un compte existe déjà avec cet email." },
        { status: 409 },
      );
    }

    const userRole = await prisma.role.findFirst({
      where: { libelle: "USER" },
    });

    if (!userRole) {
      return NextResponse.json(
        { message: "Le rôle USER est introuvable." },
        { status: 500 },
      );
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%.*?&_\-#])[A-Za-z\d@$!%*.?&_\-#]{10,}$/;

    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          message:
            "Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
        },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.utilisateur.create({
      data: {
        email,
        password: hashedPassword,
        prenom,
        nom,
        telephone,
        ville,
        pays,
        adresse_postale,
        role_id: userRole.role_id,
      },
    });

    return NextResponse.json(
      {
        message: "Compte créé avec succès.",
        user: {
          id: user.utilisateur_id,
          email: user.email,
          prenom: user.prenom,
          nom: user.nom,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}
