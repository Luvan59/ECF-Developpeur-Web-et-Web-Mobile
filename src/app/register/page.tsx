"use client";

import "./register.css";
import { useState } from "react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    adresse_postale: "",
    telephone: "",
    pays: "France",
    ville: "",
    password: "",
  });

  const isPasswordValid = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*.?&_\-#]).{10,}$/.test(
      password,
    );
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getInputClass = (
    value: string,
    validator?: (value: string) => boolean,
  ) => {
    if (value === "") return "";

    if (validator) {
      return validator(value) ? "input-valid" : "input-error";
    }

    return value.trim() !== "" ? "input-valid" : "input-error";
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (
      !formData.prenom ||
      !formData.nom ||
      !isEmailValid(formData.email) ||
      !formData.adresse_postale ||
      !formData.telephone ||
      !formData.ville ||
      !formData.pays ||
      !isPasswordValid(formData.password)
    ) {
      setErrorMessage("Veuillez corriger les champs invalides.");
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.message);
      return;
    }

    setSuccessMessage(
      "Compte créé avec succès ! Redirection vers la connexion...",
    );

    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  console.log("PASSWORD:", formData.password);
  console.log("VALID:", isPasswordValid(formData.password));

  return (
    <main>
      <div className="FormContainer">
        <form className="Formulaire" onSubmit={handleSubmit}>
          <h1>Créer un compte</h1>

          <div className="InputBox">
            <h2>Prénom</h2>
            <input
              name="prenom"
              type="text"
              value={formData.prenom}
              onChange={handleChange}
              className={getInputClass(formData.prenom)}
            />
          </div>

          <div className="InputBox">
            <h2>Nom</h2>
            <input
              name="nom"
              type="text"
              value={formData.nom}
              onChange={handleChange}
              className={getInputClass(formData.nom)}
            />
          </div>

          <div className="InputBox">
            <h2>Adresse mail</h2>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={getInputClass(formData.email, isEmailValid)}
            />
          </div>

          <div className="InputBox">
            <h2>Adresse</h2>
            <input
              name="adresse_postale"
              type="text"
              value={formData.adresse_postale}
              onChange={handleChange}
              className={getInputClass(formData.adresse_postale)}
            />
          </div>

          <div className="InputBox">
            <h2>Ville</h2>
            <input
              name="ville"
              type="text"
              value={formData.ville}
              onChange={handleChange}
              className={getInputClass(formData.ville)}
            />
          </div>

          <div className="InputBox">
            <h2>Pays</h2>
            <input
              name="pays"
              type="text"
              value={formData.pays}
              onChange={handleChange}
              className={getInputClass(formData.pays)}
            />
          </div>

          <div className="PhoneNumberInputBox">
            <h2>Numéro de téléphone</h2>
            <input
              name="telephone"
              type="text"
              value={formData.telephone}
              onChange={handleChange}
              className={getInputClass(formData.telephone)}
            />
          </div>

          <div className="PasswordSection">
            <h2>Mot de passe</h2>

            <div className="passwordBox">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={getInputClass(formData.password, isPasswordValid)}
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

            <p>
              Mot de passe de 10 caractères minimum avec caractère spécial,
              majuscule, minuscule et chiffre.
            </p>
          </div>

          {successMessage && (
            <div className="SuccessMessage">{successMessage}</div>
          )}

          {errorMessage && <div className="ErrorMessage">{errorMessage}</div>}

          <button className="ButtonSubmit" type="submit">
            Valider
          </button>
        </form>
      </div>
    </main>
  );
}
