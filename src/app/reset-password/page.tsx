"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import "./reset.password.css";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [tokenValid, setTokenValid] = useState(true);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const response = await fetch("/api/auth/verify-reset-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        setTokenValid(false);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message);
      setIsError(true);
      toast.error(data.message);
      return;
    }

    setMessage(data.message);
    setIsError(false);
    toast.success(data.message);

    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  if (!tokenValid) {
    return (
      <main className="ResetPasswordPage">
        <div className="ResetPasswordForm">
          <h1>Lien invalide ou expiré</h1>

          <p className="ResetPasswordMessageError">
            Ce lien de réinitialisation n'est plus valide.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="ResetPasswordPage">
      <form onSubmit={handleSubmit} className="ResetPasswordForm">
        <h1>Réinitialiser le mot de passe</h1>

        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit">Modifier le mot de passe</button>
      </form>
    </main>
  );
}
