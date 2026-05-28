"use client";

import Buttonfill from "@/components/buttonfill/buttonfill";
import "./menu.css";
import FilterSelect from "@/components/filtre/filtre";
import "@/components/filtre/filtre.module.css";
import { menus } from "@/data/menu";
import { useEffect, useState } from "react";
import TagItemRed from "@/components/tag_item_red/tag_item_red";
import TagItemGreen from "@/components/tag_item_green/tag_item_green";

export default function Menu() {
  const [filters, setFilters] = useState({
    maxPrice: 200,
    theme: "Tous",
    regime: "Tous",
    people: "Tous",
  });

  const [selectedMenu, setSelectedMenu] = useState<(typeof menus)[0] | null>(
    null,
  );

  const MenuItems = menus.filter((item) => {
    const matchesPrice = item.price <= filters.maxPrice;

    const matchesTheme =
      filters.theme === "Tous" || item.theme === filters.theme;

    const matchesRegime =
      filters.regime === "Tous" || item.regime === filters.regime;

    const matchesPeople =
      filters.people === "Tous" ||
      (filters.people === "6+"
        ? item.minPeople >= 6
        : item.minPeople >= Number(filters.people));

    return matchesPrice && matchesTheme && matchesRegime && matchesPeople;
  });

  useEffect(() => {
    if (selectedMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedMenu]);

  return (
    <main className="font-family-Inter">
      <div className="MenuMainTitle">
        <h1>Menu</h1>
        <FilterSelect onFilterChange={setFilters} />
        <div className="MenuBoard">
          {MenuItems.length === 0 ? (
            <p className="NoResult">Aucun menu trouvé.</p>
          ) : (
            MenuItems.map((item) => (
              <div className="MenuCard" key={item.id}>
                <h1>{item.title}</h1>

                <div className="MenuImages">
                  {item.presentationImages.map((image, index) => (
                    <img key={index} src={image} alt={item.title} />
                  ))}
                </div>

                <div>
                  <h2>Description :</h2>
                  <p className="MenuDescription">{item.description}</p>
                </div>

                <div className="MenuDetails">
                  <img
                    className="MenuDetailIcon"
                    src="/assets/icons/user-profile.png"
                    alt="Min People"
                  />
                  <span>{item.minPeople} personnes</span>
                </div>

                <div className="MenuDetails">
                  <img
                    className="MenuDetailIcon"
                    src="/assets/icons/bank-note.png"
                    alt="Price"
                  />
                  <span>
                    {item.price}€ pour {item.minPeople} personnes
                  </span>
                </div>

                <div className="MenuDetails">
                  <img
                    className="MenuDetailIcon"
                    src="/assets/icons/colors.png"
                    alt="Theme"
                  />
                  <span>{item.theme}</span>
                </div>

                <div className="MenuDetails">
                  <img
                    className="MenuDetailIcon"
                    src="/assets/icons/alert-square.png"
                    alt="Conditions"
                  />
                  <span>Conditions</span>
                </div>

                <div className="MenuConditions">{item.conditions}</div>

                <div className="MenuDetails">
                  <img
                    className="MenuDetailIcon"
                    src="/assets/icons/alert-circle.png"
                    alt="Commandes restantes"
                  />
                  <span>{item.stock} Commandes restantes</span>
                </div>

                <div className="MenuButtons">
                  <Buttonfill
                    onClick={() => setSelectedMenu(item)}
                    text="Plus d'informations"
                    width="170px"
                    height="45px"
                    fontsize="0.875rem"
                  />

                  <Buttonfill
                    text="Commander"
                    width="170px"
                    height="45px"
                    fontsize="0.875rem"
                  />
                </div>
              </div>
            ))
          )}
        </div>
        {selectedMenu && (
          <div className="ModalOverlay">
            <div className="ModalContent">
              <div className="PopUpContent">
                <div className="MenuDetailsPopUp">
                  <div className="PhotoGalleryTitle">
                    <img
                      className="MenuDetailIcon"
                      src="/assets/icons/image.png"
                      alt="Galerie photo"
                    />
                    <span>Galerie photo</span>
                  </div>
                </div>
                <div className="MenuPopUpImages">
                  {selectedMenu.images.map((image, index) => (
                    <img key={index} src={image} alt={selectedMenu.title} />
                  ))}
                </div>
              </div>
              <div className="MenuDetailsPopUp">
                <h2>Menu</h2>
                <div className="MenuDishes">
                  <div>
                    <h3>Entrée :</h3>
                    <p>{selectedMenu.dishes.starter}</p>
                  </div>
                  <div>
                    <h3>Plat :</h3>
                    <p>{selectedMenu.dishes.main}</p>
                  </div>
                  <div>
                    <h3>Dessert :</h3>
                    <p>{selectedMenu.dishes.dessert}</p>
                  </div>
                </div>
              </div>
              <div className="MenuDetailsPopUp">
                <h2>Allergie et restrictions alimentaires</h2>

                <p>{selectedMenu.allergens.length} Tags</p>
                <div className="MenuTags">
                  {selectedMenu.allergens.map((allergen, index) => (
                    <TagItemRed key={index} text={allergen} />
                  ))}
                </div>
              </div>
              <div className="MenuDetailsPopUp">
                <h2>Regime</h2>

                <p>... Tags</p>
                <div className="MenuTags">
                  <TagItemGreen text={selectedMenu.regime} />
                </div>
              </div>
              <Buttonfill
                onClick={() => setSelectedMenu(null)}
                text="Fermer"
                width="100px"
                height="40px"
                fontsize="0.875rem"
              ></Buttonfill>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
