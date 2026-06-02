import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Utilisateur non connecté." },
        { status: 401 },
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = Number(payload.id);

    const {
      nom,
      prenom,
      email,
      telephone,
      adresse,
      currentPassword,
      newPassword,
      confirmPassword,
    } = await request.json();

    if (!nom || !prenom || !email || !telephone || !adresse) {
      return NextResponse.json(
        { message: "Tous les champs personnels sont obligatoires." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Adresse email invalide." },
        { status: 400 },
      );
    }

    const user = await prisma.utilisateur.findUnique({
      where: {
        utilisateur_id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur introuvable." },
        { status: 404 },
      );
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%.*?&_\-#])[A-Za-z\d@$!%*.?&_\-#]{10,}$/;

    let passwordData = {};

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return NextResponse.json(
          {
            message:
              "Pour modifier le mot de passe, tous les champs mot de passe sont obligatoires.",
          },
          { status: 400 },
        );
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { message: "Les nouveaux mots de passe ne correspondent pas." },
          { status: 400 },
        );
      }

      if (!passwordRegex.test(newPassword)) {
        return NextResponse.json(
          {
            message:
              "Le nouveau mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
          },
          { status: 400 },
        );
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { message: "Mot de passe actuel incorrect." },
          { status: 400 },
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      passwordData = {
        password: hashedPassword,
      };
    }

    await prisma.utilisateur.update({
      where: {
        utilisateur_id: userId,
      },
      data: {
        nom,
        prenom,
        email,
        telephone,
        adresse_postale: adresse,
        ...passwordData,
      },
    });

    return NextResponse.json({
      message: "Informations mises à jour.",
    });
  } catch (error) {
    console.error("ACCOUNT UPDATE ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de la mise à jour." },
      { status: 500 },
    );
  }
}
