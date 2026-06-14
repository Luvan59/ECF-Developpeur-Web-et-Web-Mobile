"use client";

import Buttonfill from "@/components/buttonfill/buttonfill";
import "./menu.css";
import FilterSelect from "@/components/filtre/filtre";
import "@/components/filtre/filtre.module.css";
import { useEffect, useState } from "react";
import TagItemRed from "@/components/tag_item_red/tag_item_red";
import TagItemGreen from "@/components/tag_item_green/tag_item_green";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useLoadingStore } from "@/lib/loadingstore";

type MenuType = {
  id: number;
  title: string;
  description: string;
  price: number;
  minPeople: number;
  theme: string;
  regime: string;
  conditions: string;
  stock: number;
  presentationImages: string[];
  images: string[];
  dishes: {
    starter: string;
    main: string;
    dessert: string;
  };
  allergens: string[];
};

export default function Menu() {
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  const [orderMenu, setOrderMenu] = useState<MenuType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryMode, setDeliveryMode] = useState<"emporter" | "livraison">(
    "livraison",
  );
  const [selectedMenu, setSelectedMenu] = useState<MenuType | null>(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryHour, setDeliveryHour] = useState("");
  const [distanceKm, setDistanceKm] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [addressValid, setAddressValid] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState("");
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [menus, setMenus] = useState<MenuType[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(true);

  const { startLoading, stopLoading } = useLoadingStore();

  const formatPrice = (price: number) => price.toFixed(2);

  const basePrice = orderMenu ? orderMenu.price * quantity : 0;

  const discount =
    orderMenu && quantity >= orderMenu.minPeople + 5 ? basePrice * 0.1 : 0;

  const [userInfo, setUserInfo] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: "",
  });

  const totalPrice = basePrice - discount + deliveryFee;

  const [filters, setFilters] = useState({
    maxPrice: 200,
    theme: "Tous",
    regime: "Tous",
    people: "Tous",
  });

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

  const handleOpenOrderDrawer = (menu: MenuType) => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour commander.");
      router.push("/login");
      return;
    }

    setOrderMenu(menu);
    setQuantity(menu.minPeople);
    setDeliveryMode("livraison");
    setOrderDrawerOpen(true);
  };

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const response = await fetch("/api/menus");

        if (!response.ok) {
          toast.error("Erreur lors du chargement des menus.");
          return;
        }

        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error(error);
        toast.error("Impossible de récupérer les menus.");
      } finally {
        setLoadingMenus(false);
      }
    };

    loadMenus();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      const response = await fetch("/api/auth/me");

      if (!response.ok) {
        setIsAuthenticated(false);
        return;
      }

      const data = await response.json();

      setIsAuthenticated(true);

      setUserInfo({
        prenom: data.prenom || "",
        nom: data.nom || "",
        email: data.email || "",
        telephone: data.telephone || "",
        adresse: data.adresse_postale || "",
        ville: data.ville || "",
      });
    };

    loadUser();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedMenu ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedMenu]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (deliveryMode !== "livraison") {
        setDistanceKm(0);
        setDeliveryFee(0);
        setAddressValid(true);
        setAddressError("");
        return;
      }

      if (!userInfo.adresse.trim() || !userInfo.ville.trim()) {
        setDistanceKm(0);
        setDeliveryFee(0);
        setAddressValid(false);
        setAddressError("Adresse et ville obligatoires pour la livraison.");
        return;
      }

      try {
        setAddressLoading(true);

        const response = await fetch("/api/delivery-distance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adresse: userInfo.adresse,
            ville: userInfo.ville,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setDistanceKm(0);
          setDeliveryFee(0);
          setAddressValid(false);
          setAddressError(data.message);
          return;
        }

        setDistanceKm(data.distanceKm);
        setDeliveryFee(data.deliveryFee);
        setAddressValid(true);
        setAddressError("");
      } catch {
        setDistanceKm(0);
        setDeliveryFee(0);
        setAddressValid(false);
        setAddressError("Impossible de vérifier l'adresse.");
      } finally {
        setAddressLoading(false);
      }
    }, 700);

    return () => clearTimeout(timeout);
  }, [userInfo.adresse, userInfo.ville, deliveryMode]);

  const handleValidateOrder = async () => {
    if (!deliveryDate || !deliveryHour) {
      toast.error("Veuillez choisir une date et une heure.");
      return;
    }

    if (!orderMenu) {
      toast.error("Aucun menu sélectionné.");
      return;
    }

    if (deliveryMode === "livraison" && !addressValid) {
      toast.error("Veuillez renseigner une adresse de livraison valide.");
      return;
    }

    startLoading("Création de votre commande...");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menuId: orderMenu.id,
          nombrePersonne: quantity,
          datePrestation: deliveryDate,
          heureLivraison: deliveryHour,
          livraison: deliveryMode === "livraison",
          prixLivraison: deliveryFee,
          client: userInfo,
        }),
      });

      const text = await response.text();

      let data = {
        message: "Erreur lors de la création de la commande.",
      };

      try {
        data = text ? JSON.parse(text) : data;
      } catch {
        toast.error("La route API n'a pas retourné de JSON.");
        return;
      }

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Commande créée avec succès.");

      setOrderDrawerOpen(false);
      setOrderMenu(null);
      setQuantity(1);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de la commande.");
    } finally {
      stopLoading();
    }
  };

  const themeOptions = Array.from(
    new Set(menus.map((menu) => menu.theme).filter(Boolean)),
  );

  const regimeOptions = Array.from(
    new Set(menus.map((menu) => menu.regime).filter(Boolean)),
  );

  return (
    <main className="font-family-Inter">
      <div className="MenuMainTitle">
        <h1>Menu</h1>
        <FilterSelect
          onFilterChange={setFilters}
          themes={themeOptions}
          regimes={regimeOptions}
        />
        <div className="MenuBoard">
          {loadingMenus ? (
            <p>Chargement des menus...</p>
          ) : MenuItems.length === 0 ? (
            <p className="NoResult">Aucun menu trouvé.</p>
          ) : (
            MenuItems.map((item) => (
              <div className="MenuCard" key={item.id}>
                <h1>{item.title}</h1>

                <div className="MenuImages">
                  {[0, 1, 2, 3].map((index) => {
                    const image = item.presentationImages[index];

                    return image ? (
                      <img
                        key={index}
                        src={image}
                        alt={`${item.title} ${index + 1}`}
                      />
                    ) : (
                      <div key={index} className="MenuImagePlaceholderPublic">
                        <span>Photo à venir</span>
                      </div>
                    );
                  })}
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
                    onClick={() => handleOpenOrderDrawer(item)}
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
                  {selectedMenu.images.length === 0 ? (
                    <p>Aucune photo de détail disponible.</p>
                  ) : (
                    selectedMenu.images.map((image, index) => (
                      <img key={index} src={image} alt={selectedMenu.title} />
                    ))
                  )}
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
      {orderDrawerOpen && orderMenu && (
        <div className="OrderDrawerOverlay">
          <aside className="OrderDrawer">
            <button
              type="button"
              className="OrderDrawerClose"
              onClick={() => setOrderDrawerOpen(false)}
            >
              ×
            </button>

            <h2>Ma commande</h2>

            <div className="OrderModeButtons">
              <button
                type="button"
                className={deliveryMode === "emporter" ? "ActiveMode" : ""}
                onClick={() => setDeliveryMode("emporter")}
              >
                À emporter
              </button>

              <button
                type="button"
                className={deliveryMode === "livraison" ? "ActiveMode" : ""}
                onClick={() => setDeliveryMode("livraison")}
              >
                Livraison
              </button>
            </div>

            <div className="OrderDrawerCard">
              {orderMenu.presentationImages[0] ? (
                <img
                  src={orderMenu.presentationImages[0]}
                  alt={orderMenu.title}
                />
              ) : (
                <div className="OrderImageEmpty">
                  <span>Photo à venir</span>
                </div>
              )}

              <div className="OrderMenuInfo">
                <h3>{orderMenu.title}</h3>

                <p>
                  <strong>{formatPrice(orderMenu.price)} €</strong> / personne
                </p>

                <span>Minimum : {orderMenu.minPeople} personnes</span>
              </div>

              <div className="QuantityControl">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) =>
                      Math.max(orderMenu.minPeople, current - 1),
                    )
                  }
                >
                  -
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="OrderSummary">
              <div>
                <span>Menu x{quantity}</span>
                <strong>{formatPrice(basePrice)} €</strong>
              </div>

              {discount > 0 && (
                <div className="DiscountLine">
                  <span>Réduction 10%</span>
                  <strong>- {formatPrice(discount)} €</strong>
                </div>
              )}

              <div>
                <span>Frais de livraison</span>
                <strong>{formatPrice(deliveryFee)} €</strong>
              </div>

              <div className="OrderTotal">
                <span>Total</span>
                <strong>{formatPrice(totalPrice)} €</strong>
              </div>
            </div>

            <div className="OrderInformations">
              <div className="OrderSectionHeader">
                <h3>Informations</h3>
                <span>Modifiables pour cette commande</span>
              </div>

              <div className="OrderInfoGrid">
                <div className="OrderField">
                  <label>Prénom</label>
                  <input
                    value={userInfo.prenom}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, prenom: e.target.value })
                    }
                  />
                </div>

                <div className="OrderField">
                  <label>Nom</label>
                  <input
                    value={userInfo.nom}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, nom: e.target.value })
                    }
                  />
                </div>

                <div className="OrderField OrderFieldFull">
                  <label>Email</label>
                  <input
                    value={userInfo.email}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, email: e.target.value })
                    }
                  />
                </div>

                <div className="OrderField">
                  <label>Téléphone</label>
                  <input
                    value={userInfo.telephone}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, telephone: e.target.value })
                    }
                  />
                </div>

                <div className="OrderField">
                  <label>Ville</label>
                  <input
                    value={userInfo.ville}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, ville: e.target.value })
                    }
                  />
                </div>

                <div className="OrderField OrderFieldFull">
                  <label>Adresse de prestation</label>

                  <input
                    value={userInfo.adresse}
                    onChange={(e) =>
                      setUserInfo({
                        ...userInfo,
                        adresse: e.target.value,
                      })
                    }
                  />

                  {deliveryMode === "livraison" &&
                    (addressLoading || addressError || addressValid) && (
                      <p
                        className={
                          addressValid ? "AddressValid" : "AddressError"
                        }
                      >
                        {addressLoading
                          ? "Vérification de l'adresse..."
                          : addressValid
                            ? `Adresse vérifiée • ${distanceKm} km`
                            : addressError}
                      </p>
                    )}
                </div>

                <div className="OrderField">
                  <label>Date</label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>

                <div className="OrderField">
                  <label>Heure</label>
                  <input
                    type="time"
                    value={deliveryHour}
                    onChange={(e) => setDeliveryHour(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Buttonfill
              text="Valider ma commande"
              onClick={handleValidateOrder}
            ></Buttonfill>
          </aside>
        </div>
      )}
    </main>
  );
}
