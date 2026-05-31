"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type User = {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  role: string;
};

export default function UserButton() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      toast.error("Erreur lors de la déconnexion");
      return;
    }

    toast.success("Déconnexion réussie");

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch("/api/auth/me");

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();
      setUser(data);
    };

    getUser();
  }, []);

  const roleLabel =
    user?.role === "ADMIN"
      ? "Administrateur"
      : user?.role === "EMPLOYEE"
        ? "Employé"
        : "Utilisateur";

  if (!user) {
    return (
      <Link href="/login">
        <h1 className="HeaderButton">Se connecter</h1>
      </Link>
    );
  }

  return (
    <div className="UserMenu">
      <button
        type="button"
        className="HeaderButton"
        onClick={() => setIsOpen(!isOpen)}
      >
        {roleLabel} {user.prenom}
      </button>

      {isOpen && (
        <div className="UserDropdown">
          {user.role === "USER" && (
            <>
              <Link href="/account">Mon espace</Link>
              <Link href="/account/orders">Mes commandes</Link>
            </>
          )}

          {user.role === "EMPLOYEE" && (
            <>
              <Link href="/employee">Espace employé</Link>
              <Link href="/employee/orders">Gestion commandes</Link>
              <Link href="/employee/menus">Gestion menus</Link>
            </>
          )}

          {user.role === "ADMIN" && (
            <>
              <Link href="/admin">Dashboard admin</Link>
              <Link href="/admin/employees">Gestion employés</Link>
              <Link href="/admin/stats">Statistiques</Link>
            </>
          )}

          <button type="button" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
