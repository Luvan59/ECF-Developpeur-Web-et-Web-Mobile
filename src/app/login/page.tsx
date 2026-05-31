"use client";

import Link from "next/link";
import ButtonEmpty from "@/components/buttonempty/buttonempty";
import "./login.css";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    setErrorMessage("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.message);
      return;
    }

    toast.success("Connexion réussie !");

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    setForgotMessage("");
    setForgotError("");

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: forgotEmail }),
    });

    const data = await response.json();

    if (!response.ok) {
      setForgotError(data.message);
      return;
    }

    setForgotMessage(data.message);
  };

  return (
    <main>
      <form onSubmit={handleLogin}>
        <div className="LoginMain">
          <div className="Inscription">
            <h1>IDENTIFICATION</h1>
            <h2>Créer un compte</h2>

            <Link href="register">
              <ButtonEmpty
                text="Inscription"
                width="160px"
                height="72px"
                fontsize="24px"
              />
            </Link>
          </div>

          <div className="Connexion">
            <h1>Connexion au compte</h1>

            <div className="MailSection">
              <input
                type="email"
                placeholder="Adresse mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="PasswordSection">
              <div className="passwordBox">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <img src="/assets/icons/eye.png" alt="Afficher" />
                  ) : (
                    <img src="/assets/icons/eye-off.png" alt="Masquer" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="button"
              className="ForgotPasswordButton"
              onClick={() => setIsForgotOpen(true)}
            >
              Mot de passe oublié ?
            </button>

            {errorMessage && <div className="ErrorMessage">{errorMessage}</div>}

            <ButtonEmpty
              text="Connexion"
              width="160px"
              height="72px"
              fontsize="18px"
              type="submit"
            />
          </div>
        </div>
      </form>

      {isForgotOpen && (
        <div className="ForgotOverlay">
          <div className="ForgotModal">
            <button
              type="button"
              className="CloseModalButton"
              onClick={() => setIsForgotOpen(false)}
            >
              ×
            </button>

            <h2>Mot de passe oublié</h2>

            <p>
              Entrez votre adresse email. Si un compte existe, un lien de
              réinitialisation vous sera envoyé.
            </p>

            <form onSubmit={handleForgotPassword} className="ForgotForm">
              <input
                type="email"
                placeholder="Adresse mail"
                value={forgotEmail}
                onChange={(event) => setForgotEmail(event.target.value)}
                required
              />

              {forgotMessage && (
                <div className="SuccessMessage">{forgotMessage}</div>
              )}

              {forgotError && <div className="ErrorMessage">{forgotError}</div>}

              <button type="submit" className="ForgotSubmitButton">
                Envoyer le lien
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
