import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT!),
  secure: false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASSWORD!,
  },
});

export async function sendOrderFinishedEmail({
  to,
  prenom,
  numeroCommande,
}: {
  to: string;
  prenom: string;
  numeroCommande: string;
}) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Votre commande est terminée - Vite & Gourmand",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color:#ff9d00;">Votre commande est terminée</h2>

        <p>Bonjour ${prenom},</p>

        <p>
          Votre commande <strong>${numeroCommande}</strong> est maintenant terminée.
        </p>

        <p>
          Vous pouvez vous connecter à votre compte pour donner votre avis depuis votre commande.
        </p>

        <p style="margin-top: 24px;">
          Merci pour votre confiance,<br />
          <strong>Vite & Gourmand</strong>
        </p>
      </div>
    `,
  });
}
