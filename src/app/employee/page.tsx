"use client";

import "./employee.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const statuses = [
  "accepté",
  "en préparation",
  "en cours de livraison",
  "livré",
  "en attente du retour de matériel",
  "terminée",
];

export default function EmployeePage() {
  const [activeSection, setActiveSection] = useState<
    "commandes" | "menus" | "horaires" | "avis"
  >("commandes");

  const [orders, setOrders] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [horaires, setHoraires] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewFilter, setReviewFilter] = useState("");
  const [reviewSort, setReviewSort] = useState("recent");

  const [dishModal, setDishModal] = useState<
    null | "entree" | "plat" | "dessert"
  >(null);

  const [dishForm, setDishForm] = useState({
    titre: "",
    allergeneIds: [] as number[],
  });

  const [tagModal, setTagModal] = useState<
    null | "theme" | "regime" | "allergene"
  >(null);
  const [tagValue, setTagValue] = useState("");
  const [tagToDelete, setTagToDelete] = useState<any>(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [menuSearch, setMenuSearch] = useState("");
  const [menuThemeFilter, setMenuThemeFilter] = useState("");
  const [menuRegimeFilter, setMenuRegimeFilter] = useState("");
  const [menuSort, setMenuSort] = useState("titre-asc");

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  const [selectedHoraire, setSelectedHoraire] = useState<any>(null);

  const [themes, setThemes] = useState<any[]>([]);
  const [regimes, setRegimes] = useState<any[]>([]);
  const [plats, setPlats] = useState<any[]>([]);
  const [allergenes, setAllergenes] = useState<any[]>([]);

  const [modalType, setModalType] = useState<
    "status" | "cancel" | "menu" | "deleteMenu" | "horaire" | null
  >(null);

  const [newStatus, setNewStatus] = useState("");
  const [contactMode, setContactMode] = useState("mail");
  const [cancelReason, setCancelReason] = useState("");

  const [menuForm, setMenuForm] = useState({
    titre: "",
    theme: "",
    regime: "",
    prix: "",
    minimum: "",
    stock: "",
    description: "",
    entreeId: "",
    platId: "",
    dessertId: "",
    presentationImages: [] as any[],
    detailImages: [] as any[],
  });

  useEffect(() => {
    const loadData = async () => {
      const ordersResponse = await fetch("/api/employee/orders");
      const menusResponse = await fetch("/api/employee/menus");
      const horairesResponse = await fetch("/api/employee/horaires");
      const themesResponse = await fetch("/api/employee/themes");
      const regimesResponse = await fetch("/api/employee/regimes");
      const platsResponse = await fetch("/api/employee/plats");
      const allergenesResponse = await fetch("/api/employee/allergenes");
      const reviewsResponse = await fetch("/api/employee/reviews");

      if (reviewsResponse.ok) setReviews(await reviewsResponse.json());
      if (themesResponse.ok) setThemes(await themesResponse.json());
      if (regimesResponse.ok) setRegimes(await regimesResponse.json());
      if (platsResponse.ok) setPlats(await platsResponse.json());
      if (allergenesResponse.ok) setAllergenes(await allergenesResponse.json());

      if (ordersResponse.ok) {
        setOrders(await ordersResponse.json());
      }

      if (menusResponse.ok) {
        setMenus(await menusResponse.json());
      }

      if (horairesResponse.ok) {
        setHoraires(await horairesResponse.json());
      }
    };

    loadData();
  }, []);

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "presentationImages" | "detailImages",
    index: number,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const newImage = {
      file,
      preview: URL.createObjectURL(file),
    };

    const currentImages = [...menuForm[type]];
    currentImages[index] = newImage;

    setMenuForm({
      ...menuForm,
      [type]: currentImages,
    });
  };

  const [horaireForm, setHoraireForm] = useState({
    jour: "",
    ouverture: "",
    fermeture: "",
  });

  const filteredOrders = orders.filter((order) => {
    const matchStatus = statusFilter ? order.statut === statusFilter : true;

    const matchSearch =
      order.client.toLowerCase().includes(search.toLowerCase()) ||
      order.numero.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  const filteredMenus = menus
    .filter((menu) => {
      const matchSearch = menu.titre
        .toLowerCase()
        .includes(menuSearch.toLowerCase());

      const matchTheme = menuThemeFilter
        ? menu.theme === menuThemeFilter
        : true;

      const matchRegime = menuRegimeFilter
        ? menu.regime === menuRegimeFilter
        : true;

      return matchSearch && matchTheme && matchRegime;
    })
    .sort((a, b) => {
      if (menuSort === "titre-asc") {
        return a.titre.localeCompare(b.titre);
      }

      if (menuSort === "titre-desc") {
        return b.titre.localeCompare(a.titre);
      }

      if (menuSort === "prix-asc") {
        return a.prix - b.prix;
      }

      if (menuSort === "prix-desc") {
        return b.prix - a.prix;
      }

      if (menuSort === "stock-asc") {
        return a.stock - b.stock;
      }

      if (menuSort === "stock-desc") {
        return b.stock - a.stock;
      }

      return 0;
    });

  const openMenuModal = (menu?: any) => {
    if (menu) {
      setSelectedMenu(menu);
      setMenuForm({
        titre: menu.titre,
        theme: menu.theme,
        regime: menu.regime,
        prix: String(menu.prix),
        minimum: String(menu.minimum),
        stock: String(menu.stock),
        description: menu.description,

        entreeId: menu.entreeId ? String(menu.entreeId) : "",
        platId: menu.platId ? String(menu.platId) : "",
        dessertId: menu.dessertId ? String(menu.dessertId) : "",

        presentationImages: menu.presentationImages || [],
        detailImages: menu.detailImages || [],
      });
    } else {
      setSelectedMenu(null);
      setMenuForm({
        titre: "",
        theme: "",
        regime: "",
        prix: "",
        minimum: "",
        stock: "",
        description: "",

        entreeId: "",
        platId: "",
        dessertId: "",

        presentationImages: [],
        detailImages: [],
      });
    }

    setModalType("menu");
  };

  const handleStatusUpdate = () => {
    if (!selectedOrder || !newStatus) {
      toast.error("Veuillez choisir un statut.");
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === selectedOrder.id ? { ...order, statut: newStatus } : order,
      ),
    );

    toast.success("Statut de commande mis à jour.");
    setSelectedOrder(null);
    setModalType(null);
    setNewStatus("");
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancelReason) {
      toast.error("Le motif d'annulation est obligatoire.");
      return;
    }

    const response = await fetch(`/api/employee/orders/${selectedOrder.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contactMode,
        cancelReason,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== selectedOrder.id),
    );

    toast.success(data.message);

    setSelectedOrder(null);
    setModalType(null);
    setCancelReason("");
    setContactMode("mail");
  };

  const handleSaveMenu = async () => {
    if (
      !menuForm.titre ||
      !menuForm.theme ||
      !menuForm.regime ||
      !menuForm.prix ||
      !menuForm.minimum ||
      !menuForm.stock ||
      !menuForm.description
    ) {
      toast.error("Tous les champs du menu sont obligatoires.");
      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append("titre", menuForm.titre);
    formDataToSend.append("theme", menuForm.theme);
    formDataToSend.append("regime", menuForm.regime);
    formDataToSend.append("prix", menuForm.prix);
    formDataToSend.append("minimum", menuForm.minimum);
    formDataToSend.append("stock", menuForm.stock);
    formDataToSend.append("description", menuForm.description);

    menuForm.presentationImages.forEach((image) => {
      if (image.file) {
        formDataToSend.append("presentationImages", image.file);
      }
    });

    menuForm.detailImages.forEach((image) => {
      if (image.file) {
        formDataToSend.append("detailImages", image.file);
      }
    });

    const response = await fetch("/api/employee/menus", {
      method: "POST",
      body: formDataToSend,
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    toast.success(data.message);

    setMenus((currentMenus) => [
      ...currentMenus,
      {
        id: data.menuId,
        titre: menuForm.titre,
        theme: menuForm.theme,
        regime: menuForm.regime,
        prix: Number(menuForm.prix),
        minimum: Number(menuForm.minimum),
        stock: Number(menuForm.stock),
        description: menuForm.description,
        presentationImages: menuForm.presentationImages,
        detailImages: menuForm.detailImages,
        entree: "",
        plat: "",
        dessert: "",
        allergenes: [] as number[],
      },
    ]);

    setSelectedMenu(null);
    setModalType(null);
  };

  const handleCreateTag = async () => {
    if (!tagModal || !tagValue.trim()) {
      toast.error("Le nom est obligatoire.");
      return;
    }

    const endpoint =
      tagModal === "theme"
        ? "/api/employee/themes"
        : tagModal === "regime"
          ? "/api/employee/regimes"
          : "/api/employee/allergenes";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ libelle: tagValue.trim() }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    if (tagModal === "theme") {
      setThemes((current) => [...current, data]);
      setMenuForm({ ...menuForm, theme: data.libelle });
    }

    if (tagModal === "regime") {
      setRegimes((current) => [...current, data]);
      setMenuForm({ ...menuForm, regime: data.libelle });
    }

    if (tagModal === "allergene") {
      setAllergenes((current) => [...current, data]);
    }

    toast.success("Élément créé.");
    setTagModal(null);
    setTagValue("");
  };

  const handleDeleteMenu = async () => {
    if (!selectedMenu) return;

    const response = await fetch(`/api/employee/menus/${selectedMenu.id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    setMenus((currentMenus) =>
      currentMenus.filter((menu) => menu.id !== selectedMenu.id),
    );

    toast.success(data.message);
    setSelectedMenu(null);
    setModalType(null);
  };

  const openHoraireModal = (horaire: any) => {
    setSelectedHoraire(horaire);
    setHoraireForm({
      jour: horaire.jour,
      ouverture: horaire.ouverture,
      fermeture: horaire.fermeture,
    });
    setModalType("horaire");
  };

  const handleDeleteTag = async () => {
    if (!tagToDelete) return;

    let endpoint = "";

    if ("theme_id" in tagToDelete) {
      endpoint = `/api/employee/themes/${tagToDelete.theme_id}`;
    } else if ("regime_id" in tagToDelete) {
      endpoint = `/api/employee/regimes/${tagToDelete.regime_id}`;
    } else if ("allergene_id" in tagToDelete) {
      endpoint = `/api/employee/allergenes/${tagToDelete.allergene_id}`;
    }

    const response = await fetch(endpoint, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    if ("theme_id" in tagToDelete) {
      setThemes((current) =>
        current.filter((t) => t.theme_id !== tagToDelete.theme_id),
      );
    }

    if ("regime_id" in tagToDelete) {
      setRegimes((current) =>
        current.filter((r) => r.regime_id !== tagToDelete.regime_id),
      );
    }

    if ("allergene_id" in tagToDelete) {
      setAllergenes((current) =>
        current.filter((a) => a.allergene_id !== tagToDelete.allergene_id),
      );
    }

    toast.success("Supprimé.");

    setTagToDelete(null);
  };

  const handleSaveHoraire = async () => {
    if (!horaireForm.jour || !horaireForm.ouverture || !horaireForm.fermeture) {
      toast.error("Tous les champs horaires sont obligatoires.");
      return;
    }

    const isEditing = Boolean(selectedHoraire);

    const response = await fetch(
      isEditing
        ? `/api/employee/horaires/${selectedHoraire.id}`
        : "/api/employee/horaires",
      {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(horaireForm),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    if (isEditing) {
      setHoraires((currentHoraires) =>
        currentHoraires.map((horaire) =>
          horaire.id === selectedHoraire.id ? data.horaire : horaire,
        ),
      );
    } else {
      setHoraires((currentHoraires) => [...currentHoraires, data.horaire]);
    }

    toast.success(data.message);

    setSelectedHoraire(null);
    setModalType(null);
    setHoraireForm({
      jour: "",
      ouverture: "",
      fermeture: "",
    });
  };

  const handleCreateDish = async () => {
    if (!dishModal || !dishForm.titre.trim()) {
      toast.error("Le nom du plat est obligatoire.");
      return;
    }

    const response = await fetch("/api/employee/plats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titre: dishForm.titre.trim(),
        type: dishModal,
        allergeneIds: dishForm.allergeneIds,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    setPlats((current) => [...current, data]);

    if (dishModal === "entree") {
      setMenuForm({ ...menuForm, entreeId: String(data.plat_id) });
    }

    if (dishModal === "plat") {
      setMenuForm({ ...menuForm, platId: String(data.plat_id) });
    }

    if (dishModal === "dessert") {
      setMenuForm({ ...menuForm, dessertId: String(data.plat_id) });
    }

    toast.success("Élément créé.");
    setDishModal(null);
    setDishForm({
      titre: "",
      allergeneIds: [],
    });
  };

  const handleUpdateReviewStatus = async (
    id: number,
    statut: "validé" | "refusé",
  ) => {
    const response = await fetch(`/api/employee/reviews/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ statut }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    setReviews((current) =>
      current.map((review) =>
        review.id === id ? { ...review, statut } : review,
      ),
    );

    toast.success(data.message);
  };

  const filteredReviews = reviews
    .filter((review) => {
      if (!reviewFilter) return true;

      return review.statut === reviewFilter;
    })
    .sort((a, b) => {
      if (reviewSort === "ancien") {
        return (
          new Date(a.dateCreation).getTime() -
          new Date(b.dateCreation).getTime()
        );
      }

      return (
        new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
      );
    });

  
  return (
    <main className="EmployeePage">
      <section className="EmployeeHeader">
        <h1>Espace employé</h1>
        <p>
          Gérez les commandes, les menus, les horaires et les annulations après
          contact client.
        </p>
      </section>

      <div className="EmployeeTabs">
        <button
          type="button"
          className={activeSection === "commandes" ? "ActiveTab" : ""}
          onClick={() => setActiveSection("commandes")}
        >
          Commandes
        </button>

        <button
          type="button"
          className={activeSection === "menus" ? "ActiveTab" : ""}
          onClick={() => setActiveSection("menus")}
        >
          Menus
        </button>

        <button
          type="button"
          className={activeSection === "horaires" ? "ActiveTab" : ""}
          onClick={() => setActiveSection("horaires")}
        >
          Horaires
        </button>
        <button
          type="button"
          className={activeSection === "avis" ? "ActiveTab" : ""}
          onClick={() => setActiveSection("avis")}
        >
          Avis
        </button>
      </div>

      {activeSection === "commandes" && (
        <section className="EmployeeBoard">
          <div className="EmployeeFilters">
            <input
              type="text"
              placeholder="Rechercher par client ou numéro..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="en attente">En attente</option>
              <option value="accepté">Accepté</option>
              <option value="en préparation">En préparation</option>
              <option value="en cours de livraison">
                En cours de livraison
              </option>
              <option value="livré">Livré</option>
              <option value="en attente du retour de matériel">
                En attente retour matériel
              </option>
              <option value="terminée">Terminée</option>
            </select>
          </div>

          <div className="EmployeeOrders">
            {filteredOrders.length === 0 ? (
              <p className="NoEmployeeOrder">
                Aucune commande ne correspond à votre recherche.
              </p>
            ) : (
              filteredOrders.map((order) => (
                <article key={order.id} className="EmployeeOrderCard">
                  <div className="EmployeeOrderTop">
                    <h2>{order.numero}</h2>
                    <span
                      className={`EmployeeStatus ${order.statut.replaceAll(
                        " ",
                        "-",
                      )}`}
                    >
                      {order.statut}
                    </span>
                  </div>

                  <div className="EmployeeOrderDetails">
                    <p>
                      <strong>Client :</strong> {order.client}
                    </p>
                    <p>
                      <strong>Email :</strong> {order.email}
                    </p>
                    <p>
                      <strong>Téléphone :</strong> {order.telephone}
                    </p>
                    <p>
                      <strong>Menu :</strong> {order.menu}
                    </p>
                    <p>
                      <strong>Date :</strong> {order.date}
                    </p>
                    <p>
                      <strong>Heure :</strong> {order.heure}
                    </p>
                    <p>
                      <strong>Total :</strong> {order.total}
                    </p>
                    <p>
                      <strong>Matériel prêté :</strong>{" "}
                      {order.materiel ? "Oui" : "Non"}
                    </p>
                  </div>

                  <div className="EmployeeActions">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrder(order);
                        setNewStatus(order.statut);
                        setModalType("status");
                      }}
                    >
                      Modifier le statut
                    </button>

                    <button
                      type="button"
                      className="EmployeeCancelButton"
                      onClick={() => {
                        setSelectedOrder(order);
                        setModalType("cancel");
                      }}
                    >
                      Annuler la commande
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      )}

      {activeSection === "menus" && (
        <section className="EmployeeBoard">
          <h2 className="EmployeeSectionTitle">Gestion des menus</h2>

          <div className="EmployeeActionsTop">
            <button
              type="button"
              className="CreateMenuButton"
              onClick={() => openMenuModal()}
            >
              + Créer un menu
            </button>
          </div>

          <div className="EmployeeFilters MenuFilters">
            <input
              type="text"
              placeholder="Rechercher un menu..."
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
            />

            <select
              value={menuThemeFilter}
              onChange={(e) => setMenuThemeFilter(e.target.value)}
            >
              <option value="">Tous les thèmes</option>
              {themes.map((theme) => (
                <option key={theme.theme_id} value={theme.libelle}>
                  {theme.libelle}
                </option>
              ))}
            </select>

            <select
              value={menuRegimeFilter}
              onChange={(e) => setMenuRegimeFilter(e.target.value)}
            >
              <option value="">Tous les régimes</option>
              {regimes.map((regime) => (
                <option key={regime.regime_id} value={regime.libelle}>
                  {regime.libelle}
                </option>
              ))}
            </select>

            <select
              value={menuSort}
              onChange={(e) => setMenuSort(e.target.value)}
            >
              <option value="titre-asc">Titre A-Z</option>
              <option value="titre-desc">Titre Z-A</option>
              <option value="prix-asc">Prix croissant</option>
              <option value="prix-desc">Prix décroissant</option>
              <option value="stock-asc">Stock croissant</option>
              <option value="stock-desc">Stock décroissant</option>
            </select>
          </div>

          <div className="EmployeeList">
            {filteredMenus.map((menu) => (
              <article key={menu.id} className="EmployeeManageCard">
                <div className="EmployeeManageHeader">
                  <h3>{menu.titre}</h3>
                  <span>{menu.regime}</span>
                </div>

                <p>
                  <strong>Thème :</strong> {menu.theme}
                </p>

                <p>
                  <strong>Prix :</strong> {menu.prix} € / personne
                </p>

                <p>
                  <strong>Minimum :</strong> {menu.minimum} personnes
                </p>

                <p>
                  <strong>Stock :</strong> {menu.stock} commandes restantes
                </p>

                <p>
                  <strong>Description :</strong> {menu.description}
                </p>

                <div>
                  <strong>Photos de présentation :</strong>

                  <div className="MenuPresentationImages">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="MenuImagePlaceholder">
                        {menu.presentationImages?.[index]?.preview ? (
                          <img
                            src={
                              menu.presentationImages?.[index]?.preview ||
                              menu.presentationImages?.[index]?.url
                            }
                            alt={`Photo présentation ${index + 1}`}
                          />
                        ) : (
                          `Photo ${index + 1}`
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <strong>Photos de détail :</strong>

                  <div className="MenuDetailImages">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <div key={index} className="MenuImagePlaceholder">
                        {menu.detailImages?.[index]?.preview ? (
                          <img
                            src={menu.detailImages[index].preview}
                            alt={`Photo détail ${index + 1}`}
                          />
                        ) : (
                          `Détail ${index + 1}`
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="EmployeeActions">
                  <button type="button" onClick={() => openMenuModal(menu)}>
                    Modifier
                  </button>

                  <button
                    type="button"
                    className="EmployeeCancelButton"
                    onClick={() => {
                      setSelectedMenu(menu);
                      setModalType("deleteMenu");
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeSection === "horaires" && (
        <section className="EmployeeBoard">
          <h2 className="EmployeeSectionTitle">Gestion des horaires</h2>

          <div className="EmployeeActionsTop">
            <button
              type="button"
              className="CreateMenuButton"
              onClick={() => {
                setSelectedHoraire(null);
                setHoraireForm({
                  jour: "",
                  ouverture: "",
                  fermeture: "",
                });
                setModalType("horaire");
              }}
            >
              + Créer un horaire
            </button>
          </div>

          <div className="EmployeeList">
            {horaires.map((horaire) => (
              <article key={horaire.id} className="EmployeeManageCard">
                <h3>{horaire.jour}</h3>

                <p>
                  <strong>Ouverture :</strong> {horaire.ouverture}
                </p>

                <p>
                  <strong>Fermeture :</strong> {horaire.fermeture}
                </p>

                <div className="EmployeeActions">
                  <button
                    type="button"
                    onClick={() => openHoraireModal(horaire)}
                  >
                    Modifier
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeSection === "avis" && (
        <section className="EmployeeBoard">
          <h2 className="EmployeeSectionTitle">Gestion des avis</h2>

          <div className="EmployeeFilters">
            <select
              value={reviewFilter}
              onChange={(e) => setReviewFilter(e.target.value)}
            >
              <option value="">Tous les avis</option>
              <option value="en attente">En attente</option>
              <option value="validé">Validés</option>
              <option value="refusé">Refusés</option>
            </select>

            <select
              value={reviewSort}
              onChange={(e) => setReviewSort(e.target.value)}
            >
              <option value="recent">Plus récents</option>
              <option value="ancien">Plus anciens</option>
            </select>
          </div>

          <div className="EmployeeList">
            {filteredReviews.length === 0 ? (
              <p className="NoEmployeeOrder">Aucun avis trouvé.</p>
            ) : (
              filteredReviews.map((review) => (
                <article key={review.id} className="EmployeeManageCard">
                  <div className="EmployeeManageHeader">
                    <h3>{review.client}</h3>
                    <span>{review.statut}</span>
                  </div>

                  <p>
                    <strong>Email :</strong> {review.email}
                  </p>

                  <p>
                    <strong>Note :</strong> {"★".repeat(review.note)}
                    {"☆".repeat(5 - review.note)}
                  </p>

                  <p>
                    <strong>Commentaire :</strong> {review.description}
                  </p>

                  <div className="EmployeeActions">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateReviewStatus(review.id, "validé")
                      }
                    >
                      Valider
                    </button>

                    <button
                      type="button"
                      className="EmployeeCancelButton"
                      onClick={() =>
                        handleUpdateReviewStatus(review.id, "refusé")
                      }
                    >
                      Refuser
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      )}

      {modalType && (
        <div className="EmployeeModalOverlay">
          <div className="EmployeeModal">
            <button
              type="button"
              className="EmployeeModalClose"
              onClick={() => {
                setSelectedOrder(null);
                setSelectedMenu(null);
                setSelectedHoraire(null);
                setModalType(null);
              }}
            >
              ×
            </button>

            {modalType === "status" && selectedOrder && (
              <>
                <h2>Modifier le statut</h2>
                <p>
                  Commande <strong>{selectedOrder.numero}</strong>
                </p>

                <select
                  value={newStatus}
                  onChange={(event) => setNewStatus(event.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <button type="button" onClick={handleStatusUpdate}>
                  Enregistrer
                </button>
              </>
            )}

            {modalType === "cancel" && selectedOrder && (
              <>
                <h2>Annuler la commande</h2>
                <p>
                  Avant annulation, l’employé doit avoir contacté le client par
                  téléphone ou par email.
                </p>

                <label>Mode de contact</label>
                <select
                  value={contactMode}
                  onChange={(event) => setContactMode(event.target.value)}
                >
                  <option value="mail">Mail</option>
                  <option value="telephone">Téléphone</option>
                </select>

                <label>Motif d’annulation</label>
                <textarea
                  value={cancelReason}
                  onChange={(event) => setCancelReason(event.target.value)}
                  placeholder="Expliquez le motif de l'annulation..."
                />

                <button
                  type="button"
                  className="EmployeeCancelButton"
                  onClick={handleCancelOrder}
                >
                  Confirmer l’annulation
                </button>
              </>
            )}

            {modalType === "menu" && (
              <>
                <h2>{selectedMenu ? "Modifier le menu" : "Créer un menu"}</h2>
                <div className="FormGroup">
                  <label>Titre du menu</label>

                  <input
                    value={menuForm.titre}
                    onChange={(e) =>
                      setMenuForm({
                        ...menuForm,
                        titre: e.target.value,
                      })
                    }
                    placeholder="Ex : Menu Mariage Prestige"
                  />
                </div>
                <div className="FormGroup">
                  <label>Thème du menu</label>
                  <select
                    value={menuForm.theme}
                    onChange={(e) =>
                      setMenuForm({ ...menuForm, theme: e.target.value })
                    }
                  >
                    <option value="">Choisir un thème</option>
                    {themes.map((theme) => (
                      <option key={theme.theme_id} value={theme.libelle}>
                        {theme.libelle}
                      </option>
                    ))}
                  </select>

                  <button type="button" onClick={() => setTagModal("theme")}>
                    + Créer un thème
                  </button>
                  <button
                    type="button"
                    className="EmployeeCancelButton"
                    onClick={() => {
                      const selected = themes.find(
                        (theme) => theme.libelle === menuForm.theme,
                      );
                      if (!selected)
                        return toast.error("Sélectionnez un thème.");
                      setTagToDelete(selected);
                    }}
                  >
                    Supprimer le thème
                  </button>
                </div>

                <div className="FormGroup">
                  <label>Régime alimentaire</label>
                  <select
                    value={menuForm.regime}
                    onChange={(e) =>
                      setMenuForm({ ...menuForm, regime: e.target.value })
                    }
                  >
                    <option value="">Choisir un régime</option>
                    {regimes.map((regime) => (
                      <option key={regime.regime_id} value={regime.libelle}>
                        {regime.libelle}
                      </option>
                    ))}
                  </select>

                  <button type="button" onClick={() => setTagModal("regime")}>
                    + Créer un régime
                  </button>
                  <button
                    type="button"
                    className="EmployeeCancelButton"
                    onClick={() => {
                      const selected = regimes.find(
                        (regime) => regime.libelle === menuForm.regime,
                      );

                      if (!selected) {
                        toast.error("Sélectionnez un régime.");
                        return;
                      }

                      setTagToDelete(selected);
                    }}
                  >
                    Supprimer le régime
                  </button>
                </div>

                <div className="FormGroup">
                  <label>Entrée</label>

                  <select
                    value={menuForm.entreeId}
                    onChange={(e) =>
                      setMenuForm({ ...menuForm, entreeId: e.target.value })
                    }
                  >
                    <option value="">Choisir une entrée</option>
                    {plats
                      .filter((plat) => plat.type === "entree")
                      .map((plat) => (
                        <option key={plat.plat_id} value={plat.plat_id}>
                          {plat.titre_plat}
                        </option>
                      ))}
                  </select>

                  <button type="button" onClick={() => setDishModal("entree")}>
                    + Créer une entrée
                  </button>
                </div>

                <div className="FormGroup">
                  <label>Plat principal</label>

                  <select
                    value={menuForm.platId}
                    onChange={(e) =>
                      setMenuForm({ ...menuForm, platId: e.target.value })
                    }
                  >
                    <option value="">Choisir un plat</option>
                    {plats
                      .filter((plat) => plat.type === "plat")
                      .map((plat) => (
                        <option key={plat.plat_id} value={plat.plat_id}>
                          {plat.titre_plat}
                        </option>
                      ))}
                  </select>

                  <button type="button" onClick={() => setDishModal("plat")}>
                    + Créer un plat
                  </button>
                </div>

                <div className="FormGroup">
                  <label>Dessert</label>

                  <select
                    value={menuForm.dessertId}
                    onChange={(e) =>
                      setMenuForm({ ...menuForm, dessertId: e.target.value })
                    }
                  >
                    <option value="">Choisir un dessert</option>
                    {plats
                      .filter((plat) => plat.type === "dessert")
                      .map((plat) => (
                        <option key={plat.plat_id} value={plat.plat_id}>
                          {plat.titre_plat}
                        </option>
                      ))}
                  </select>

                  <button type="button" onClick={() => setDishModal("dessert")}>
                    + Créer un dessert
                  </button>
                </div>

                <div className="FormGroup">
                  <label>Prix par personne (€)</label>
                  <input
                    type="number"
                    value={menuForm.prix}
                    onChange={(e) =>
                      setMenuForm({ ...menuForm, prix: e.target.value })
                    }
                  />
                </div>

                <div className="FormGroup">
                  <label>Nombre minimum de personnes</label>
                  <input
                    type="number"
                    value={menuForm.minimum}
                    onChange={(e) =>
                      setMenuForm({ ...menuForm, minimum: e.target.value })
                    }
                  />
                </div>

                <div className="FormGroup">
                  <label>Nombre de commandes restantes</label>
                  <input
                    type="number"
                    value={menuForm.stock}
                    onChange={(e) =>
                      setMenuForm({ ...menuForm, stock: e.target.value })
                    }
                  />
                </div>

                <div className="FormGroup">
                  <label>Description du menu</label>
                  <textarea
                    value={menuForm.description}
                    onChange={(e) =>
                      setMenuForm({
                        ...menuForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <label>Photos de présentation</label>

                <div className="UploadGrid PresentationUploadGrid">
                  {[0, 1, 2, 3].map((index) => (
                    <label key={index} className="UploadBox">
                      {menuForm.presentationImages[index] ? (
                        <img
                          src={menuForm.presentationImages[index].preview}
                          alt={`Présentation ${index + 1}`}
                        />
                      ) : (
                        <span>+ Photo {index + 1}</span>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(event) =>
                          handleImageUpload(event, "presentationImages", index)
                        }
                      />
                    </label>
                  ))}
                </div>

                <label>Photos de détail</label>

                <div className="UploadGrid DetailUploadGrid">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <label key={index} className="UploadBox">
                      {menuForm.detailImages[index] ? (
                        <img
                          src={menuForm.detailImages[index].preview}
                          alt={`Détail ${index + 1}`}
                        />
                      ) : (
                        <span>+ Détail {index + 1}</span>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(event) =>
                          handleImageUpload(event, "detailImages", index)
                        }
                      />
                    </label>
                  ))}
                </div>

                <button type="button" onClick={handleSaveMenu}>
                  Enregistrer
                </button>
              </>
            )}

            {modalType === "deleteMenu" && selectedMenu && (
              <>
                <h2>Supprimer le menu</h2>
                <p>
                  Êtes-vous sûr de vouloir supprimer{" "}
                  <strong>{selectedMenu.titre}</strong> ?
                </p>

                <button
                  type="button"
                  className="EmployeeCancelButton"
                  onClick={handleDeleteMenu}
                >
                  Oui, supprimer
                </button>
              </>
            )}

            {modalType === "horaire" && (
              <>
                <h2>
                  {selectedHoraire ? "Modifier l’horaire" : "Créer un horaire"}
                </h2>

                <div className="FormGroup">
                  <label>Jour</label>

                  <input
                    value={horaireForm.jour}
                    onChange={(e) =>
                      setHoraireForm({
                        ...horaireForm,
                        jour: e.target.value,
                      })
                    }
                    placeholder="Ex : Lundi"
                  />
                </div>

                <div className="FormGroup">
                  <label>Heure d'ouverture</label>

                  <input
                    type="time"
                    value={horaireForm.ouverture}
                    onChange={(e) =>
                      setHoraireForm({
                        ...horaireForm,
                        ouverture: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="FormGroup">
                  <label>Heure de fermeture</label>

                  <input
                    type="time"
                    value={horaireForm.fermeture}
                    onChange={(e) =>
                      setHoraireForm({
                        ...horaireForm,
                        fermeture: e.target.value,
                      })
                    }
                  />
                </div>

                <button type="button" onClick={handleSaveHoraire}>
                  Enregistrer
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {tagModal && (
        <div className="EmployeeSubModalOverlay">
          <div className="EmployeeSubModal">
            <button
              type="button"
              className="EmployeeModalClose"
              onClick={() => {
                setTagModal(null);
                setTagValue("");
              }}
            >
              ×
            </button>

            <h2>
              Créer{" "}
              {tagModal === "theme"
                ? "un thème"
                : tagModal === "regime"
                  ? "un régime"
                  : "un allergène"}
            </h2>

            <div className="FormGroup">
              <label>Nom</label>
              <input
                value={tagValue}
                onChange={(e) => setTagValue(e.target.value)}
                placeholder="Ex : Vegan, Noël, Fruits à coque..."
              />
            </div>

            <button type="button" onClick={handleCreateTag}>
              Créer
            </button>
          </div>
        </div>
      )}
      {tagToDelete && (
        <div className="EmployeeModalOverlay">
          <div className="EmployeeModal">
            <h2>Supprimer</h2>

            <p>
              Êtes-vous sûr de vouloir supprimer{" "}
              <strong>{tagToDelete.libelle}</strong> ?
            </p>

            <button
              type="button"
              className="EmployeeCancelButton"
              onClick={handleDeleteTag}
            >
              Oui, supprimer
            </button>

            <button type="button" onClick={() => setTagToDelete(null)}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {dishModal && (
        <div className="EmployeeModalOverlay">
          <div className="EmployeeModal">
            <button
              type="button"
              className="EmployeeModalClose"
              onClick={() => {
                setDishModal(null);
                setDishForm({
                  titre: "",
                  allergeneIds: [],
                });
              }}
            >
              ×
            </button>

            <h2>
              Créer{" "}
              {dishModal === "entree"
                ? "une entrée"
                : dishModal === "plat"
                  ? "un plat"
                  : "un dessert"}
            </h2>

            <div className="FormGroup">
              <label>Nom</label>
              <input
                value={dishForm.titre}
                onChange={(e) =>
                  setDishForm({
                    ...dishForm,
                    titre: e.target.value,
                  })
                }
                placeholder="Ex : Salade composée"
              />
            </div>

            <div className="FormGroup">
              <label>Allergènes</label>

              <div className="TagCheckboxGrid">
                {allergenes.map((allergene) => (
                  <label key={allergene.allergene_id} className="TagCheckbox">
                    <input
                      type="checkbox"
                      checked={dishForm.allergeneIds.includes(
                        allergene.allergene_id,
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setDishForm({
                            ...dishForm,
                            allergeneIds: [
                              ...dishForm.allergeneIds,
                              allergene.allergene_id,
                            ],
                          });
                        } else {
                          setDishForm({
                            ...dishForm,
                            allergeneIds: dishForm.allergeneIds.filter(
                              (id) => id !== allergene.allergene_id,
                            ),
                          });
                        }
                      }}
                    />

                    {allergene.libelle}
                  </label>
                ))}
              </div>

              <button type="button" onClick={() => setTagModal("allergene")}>
                + Créer un allergène
              </button>
            </div>

            <button type="button" onClick={handleCreateDish}>
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
