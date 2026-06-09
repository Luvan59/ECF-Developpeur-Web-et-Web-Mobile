import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const employeeId = Number(id);

    const { actif } = await request.json();

    const employee = await prisma.utilisateur.update({
      where: {
        utilisateur_id: employeeId,
      },
      data: {
        actif: Boolean(actif),
      },
    });

    return NextResponse.json({
      message: employee.actif
        ? "Compte employé réactivé."
        : "Compte employé désactivé.",
      employee: {
        id: employee.utilisateur_id,
        email: employee.email,
        prenom: employee.prenom,
        nom: employee.nom,
        actif: employee.actif,
      },
    });
  } catch (error) {
    console.error("UPDATE EMPLOYEE ACTIVE ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de la modification du compte employé." },
      { status: 500 },
    );
  }
}
