"use client";

import "./contact.css";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    email: "",
    title: "",
    description: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log("CONTACT SUBMIT", formData);

    setErrorMessage("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrorMessage(data.message);
      toast.error(data.message);
      return;
    }

    toast.success(data.message);

    setFormData({
      email: "",
      title: "",
      description: "",
    });
  };

  return (
    <main className="ContactPage">
      <form className="ContactForm" onSubmit={handleSubmit}>
        <h1>Contactez-nous</h1>

        <p className="ContactIntro">
          Une question, une demande particulière ou besoin d'informations ?
          Envoyez-nous un message, nous vous répondrons par email.
        </p>

        <div className="ContactInputBox">
          <h2>Adresse mail</h2>
          <input
            name="email"
            type="email"
            placeholder="votre.email@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="ContactInputBox">
          <h2>Titre</h2>
          <input
            name="title"
            type="text"
            placeholder="Objet de votre demande"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="ContactInputBox">
          <h2>Description</h2>
          <textarea
            name="description"
            placeholder="Votre message..."
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {errorMessage && <div className="ErrorMessage">{errorMessage}</div>}

        <button className="ContactSubmitButton" type="submit">
          Envoyer
        </button>
      </form>
    </main>
  );
}
