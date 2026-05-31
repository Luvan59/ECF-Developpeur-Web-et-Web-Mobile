import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mail";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "Si un compte existe, un email de réinitialisation sera envoyé.",
        },
        { status: 200 },
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.passwordResetToken.create({
      data: {
        token,
        utilisateur_id: user.utilisateur_id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 30),
      },
    });

    const resetLink = `${process.env.APP_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: "Réinitialisation du mot de passe",
      html: `
        <h2>Vite & Gourmand</h2>
        <p>Vous avez demandé une réinitialisation du mot de passe.</p>

        <p>
          <a href="${resetLink}">
            Réinitialiser mon mot de passe
          </a>
        </p>

        <p>Ce lien expire dans 30 minutes.</p>
      `,
    });

    return NextResponse.json({
      message: "Email envoyé.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: "Erreur serveur." }, { status: 500 });
  }
}
