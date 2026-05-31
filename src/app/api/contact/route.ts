import { NextResponse } from "next/server";
import { transporter } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { email, title, description } = await request.json();

    console.log("CONTACT API", { email, title, description });

    if (!email || !title || !description) {
      return NextResponse.json(
        { message: "Tous les champs sont obligatoires." },
        { status: 400 },
      );
    }

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: "vite.gourmand.contact33000@gmail.com",
      replyTo: email,
      subject: `Nouveau message contact : ${title}`,
      html: `
        <h2>Nouveau message depuis le formulaire de contact</h2>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Titre :</strong> ${title}</p>
        <p><strong>Description :</strong></p>
        <p>${description}</p>
      `,
    });

    return NextResponse.json({
      message: "Votre message a bien été envoyé.",
    });
  } catch (error) {
    console.error("CONTACT ERROR:", error);

    return NextResponse.json(
      { message: "Erreur lors de l'envoi du message." },
      { status: 500 },
    );
  }
}
