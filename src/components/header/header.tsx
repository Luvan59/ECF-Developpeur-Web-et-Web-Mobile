"use client";

import Link from "next/link";
import { useState } from "react";
import UserButton from "@/components/userbutton/UserButton";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header>
      <div className="HeaderMain">
        <Link href="/" onClick={closeMenu}>
          <h1 className="HeaderLogo">Vite & Gourmand</h1>
        </Link>

        <button
          type="button"
          className="BurgerButton"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Ouvrir le menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={menuOpen ? "HeaderButtons MobileOpen" : "HeaderButtons"}
        >
          <Link href="/" onClick={closeMenu}>
            <h1 className="HeaderButton">Accueil</h1>
          </Link>

          <Link href="/menu" onClick={closeMenu}>
            <h1 className="HeaderButton">Menu</h1>
          </Link>

          <Link href="/contact" onClick={closeMenu}>
            <h1 className="HeaderButton">Contact</h1>
          </Link>

          <UserButton />
        </nav>
      </div>
    </header>
  );
}
