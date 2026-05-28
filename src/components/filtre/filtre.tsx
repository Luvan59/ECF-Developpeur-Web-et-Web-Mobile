"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "./filtre.module.css";

const themes = ["Tous", "Classique", "Événement", "Pâques"];
const regimes = ["Tous", "Classique", "Vegan", "Végétarien"];
const peopleOptions = ["Tous", "1", "2", "3", "4", "5", "6+"];

export default function FilterSelect({ onFilterChange }: FilterSelectProps) {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 80 });
  const [theme, setTheme] = useState("Tous");
  const [regime, setRegime] = useState("Tous");
  const [people, setPeople] = useState("Tous");
  const [showFilters, setShowFilters] = useState(false);

  const activeFilters = useMemo(() => {
    const filters = [`Prix max : ${priceRange.max}€`];

    if (theme !== "Tous") {
      filters.push(`Thème : ${theme}`);
    }
    if (regime !== "Tous") {
      filters.push(`Régime : ${regime}`);
    }
    if (people !== "Tous") {
      filters.push(`Personnes : ${people}`);
    }

    return filters;
  }, [priceRange, theme, regime, people]);

  type FilterSelectProps = {
    onFilterChange: (filters: {
      maxPrice: number;
      theme: string;
      regime: string;
      people: string;
    }) => void;
  };

  useEffect(() => {
    onFilterChange({
      maxPrice: priceRange.max,
      theme,
      regime,
      people,
    });
  }, [priceRange, theme, regime, people]);

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(event.target.value);
    setPriceRange((current) => ({
      min: current.min,
      max: Math.max(newMax, current.min),
    }));
  };

  return (
    <div className={styles["filter-container"]}>
      <button
        type="button"
        onClick={() => setShowFilters((current) => !current)}
        className={styles["filter-toggle-button"]}
      >
        {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
      </button>

      {showFilters ? (
        <div className={styles["filter-options"]}>
          <div className={styles["filter-group"]}>
            <label className={styles["price-label"]}>
              Prix maximum : {priceRange.max}€
            </label>
            <input
              id="price-max"
              type="range"
              min={0}
              max={200}
              value={priceRange.max}
              onChange={handleMaxChange}
            />
          </div>

          <div className={styles["filter-group"]}>
            <label>Thème</label>
            <select
              id="theme"
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
            >
              {themes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles["filter-group"]}>
            <label>Régime</label>
            <select
              id="regime"
              value={regime}
              onChange={(event) => setRegime(event.target.value)}
            >
              {regimes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles["filter-group"]}>
            <label>Nombre de personnes</label>
            <select
              id="people"
              value={people}
              onChange={(event) => setPeople(event.target.value)}
            >
              {peopleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}
    </div>
  );
}
