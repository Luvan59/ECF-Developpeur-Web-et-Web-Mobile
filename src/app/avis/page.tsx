"use client";

import "./avis.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Avis = {
  id: number;
  auteur: string;
  note: number;
  commentaire: string;
  statut: string;
};

export default function AvisPage() {
  const [avis, setAvis] = useState<Avis[]>([]);

  useEffect(() => {
    const getAvis = async () => {
      const response = await fetch("/api/reviews");

      if (!response.ok) {
        toast.error("Erreur lors du chargement des avis.");
        return;
      }

      const data = await response.json();
      setAvis(data);
    };

    getAvis();
  }, []);

  return (
    <main className="AvisPage">
      <section className="AvisContainer">
        <h1>Avis clients</h1>

        <p className="AvisIntro">
          Retrouvez les avis laissés par nos clients après leurs commandes.
        </p>

        {avis.length === 0 ? (
          <p className="NoAvisMessage">Aucun avis disponible pour le moment.</p>
        ) : (
          <div className="AvisGrid">
            {avis.map((item) => (
              <article key={item.id} className="AvisCard">
                <div className="AvisTop">
                  <h2>{item.auteur}</h2>
                </div>

                <div className="AvisNote">
                  {"★".repeat(item.note)}
                  {"☆".repeat(5 - item.note)}
                </div>

                <p>{item.commentaire}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
