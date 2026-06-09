import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const employees = await prisma.utilisateur.findMany({
      where: {
        role: {
          libelle: "EMPLOYEE",
        },
      },
      include: {
        role: true,
      },
      orderBy: {
        utilisateur_id: "desc",
      },
    });

    return NextResponse.json(
      employees.map((employee) => ({
        id: employee.utilisateur_id,
        email: employee.email,
        prenom: employee.prenom,
        nom: employee.nom,
        telephone: employee.telephone,
        actif: employee.actif,
      })),
    );
  } catch (error) {
    console.error("GET ADMIN EMPLOYEES ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors du chargement des employés." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { email, password, prenom, nom } = await request.json();

    if (!email || !password || !prenom || !nom) {
      return NextResponse.json(
        { message: "Email, mot de passe, prénom et nom obligatoires." },
        { status: 400 },
      );
    }

    const existingUser = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Un compte existe déjà avec cet email." },
        { status: 400 },
      );
    }

    const employeeRole = await prisma.role.findFirst({
      where: {
        libelle: "EMPLOYEE",
      },
    });

    if (!employeeRole) {
      return NextResponse.json(
        { message: "Le rôle EMPLOYEE n'existe pas dans la base de données." },
        { status: 500 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await prisma.utilisateur.create({
      data: {
        email,
        password: hashedPassword,
        prenom,
        nom,
        telephone: "",
        ville: "",
        pays: "",
        adresse_postale: "",
        actif: true,
        role_id: employeeRole.role_id,
      },
    });

    return NextResponse.json({
      message: "Compte employé créé avec succès.",
      employee: {
        id: employee.utilisateur_id,
        email: employee.email,
        prenom: employee.prenom,
        nom: employee.nom,
        telephone: employee.telephone,
        actif: employee.actif,
      },
    });
  } catch (error) {
    console.error("CREATE ADMIN EMPLOYEE ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de la création de l'employé." },
      { status: 500 },
    );
  }
}
