"use client";

import "./account.css";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [modalType, setModalType] = useState<
    "detail" | "suivi" | "delete" | "review" | null
  >(null);

  const [reviewNote, setReviewNote] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(?=\d)/g, "$1 ");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    if (event.target.name === "telephone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  const handleReviewSubmit = async () => {
    const response = await fetch("/api/account/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commandeId: selectedOrder.id,
        note: reviewNote,
        commentaire: reviewComment,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    toast.success(data.message);

    setReviewComment("");
    setReviewNote(5);

    setSelectedOrder(null);
    setModalType(null);
  };

  const handleCancel = () => {
    if (!user) return;

    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone,
      adresse: user.adresse,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setIsEditing(false);
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;

    const response = await fetch(`/api/account/orders/${selectedOrder.id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    toast.success(data.message);

    setOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== selectedOrder.id),
    );

    setSelectedOrder(null);
    setModalType(null);
  };

  const handleSave = async () => {
    if (
      !formData.nom ||
      !formData.prenom ||
      !formData.email ||
      !formData.telephone ||
      !formData.adresse
    ) {
      toast.error("Tous les champs personnels sont obligatoires.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      toast.error("Adresse email invalide.");
      return;
    }

    if (formData.telephone.length !== 10) {
      toast.error("Le numéro de téléphone doit contenir 10 chiffres.");
      return;
    }

    if (
      formData.newPassword ||
      formData.confirmPassword ||
      formData.currentPassword
    ) {
      if (
        !formData.currentPassword ||
        !formData.newPassword ||
        !formData.confirmPassword
      ) {
        toast.error("Tous les champs mot de passe sont obligatoires.");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas.");
        return;
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/;

      if (!passwordRegex.test(formData.newPassword)) {
        toast.error(
          "Le mot de passe doit contenir 10 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial.",
        );
        return;
      }
    }

    const handleReviewSubmit = async () => {
      const response = await fetch("/api/account/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commandeId: selectedOrder.id,
          note: reviewNote,
          commentaire: reviewComment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      setReviewComment("");
      setReviewNote(5);

      setSelectedOrder(null);
      setModalType(null);
    };

    const response = await fetch("/api/account/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    toast.success(data.message);

    setUser({
      ...user,
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      telephone: formData.telephone,
      adresse: formData.adresse,
    });

    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setIsEditing(false);
  };

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch("/api/auth/me");

      if (!response.ok) {
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      setUser(data);

      setFormData({
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        telephone: data.telephone,
        adresse: data.adresse,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    };

    const getOrders = async () => {
      const response = await fetch("/api/account/orders");

      if (!response.ok) {
        toast.error("Erreur lors du chargement des commandes.");
        return;
      }

      const data = await response.json();
      setOrders(data);
    };

    getUser();
    getOrders();
  }, []);

  if (!user) {
    return <main className="AccountPage">Chargement...</main>;
  }

  return (
    <main className="AccountPage">
      <section className="AccountHeader">
        <h1>Espace utilisateur</h1>
        <p>
          Bienvenue {user.prenom}, vous pouvez gérer vos informations et vos
          commandes.
        </p>
      </section>

      <section className="AccountGrid">
        <div className="AccountCard">
          <h2>Mes informations</h2>

          <div className="UserInfo">
            <div>
              <strong>Nom :</strong>
              {isEditing ? (
                <input
                  required
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                />
              ) : (
                <span>{formData.nom}</span>
              )}
            </div>

            <div>
              <strong>Prénom :</strong>
              {isEditing ? (
                <input
                  required
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                />
              ) : (
                <span>{formData.prenom}</span>
              )}
            </div>

            <div>
              <strong>Email :</strong>
              {isEditing ? (
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              ) : (
                <span>{formData.email}</span>
              )}
            </div>

            <div>
              <strong>Téléphone :</strong>
              {isEditing ? (
                <input
                  required
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              ) : (
                <span>{formatPhone(formData.telephone)}</span>
              )}
            </div>

            <div>
              <strong>Adresse :</strong>
              {isEditing ? (
                <input
                  required
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                />
              ) : (
                <span>{formData.adresse}</span>
              )}
            </div>

            {isEditing && (
              <>
                <h3 className="PasswordTitle">Modifier le mot de passe</h3>

                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Mot de passe actuel"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />

                <input
                  type="password"
                  name="newPassword"
                  placeholder="Nouveau mot de passe"
                  value={formData.newPassword}
                  onChange={handleChange}
                />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmer le mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </>
            )}
          </div>

          {isEditing ? (
            <div className="AccountButtons">
              <button
                type="button"
                className="AccountButton"
                onClick={handleSave}
              >
                Enregistrer
              </button>

              <button
                type="button"
                className="AccountButtonCancel"
                onClick={handleCancel}
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="AccountButton"
              onClick={() => setIsEditing(true)}
            >
              Modifier mes informations
            </button>
          )}
        </div>

        <div className="AccountCard">
          <h2>Mes commandes</h2>

          <div className="OrdersList">
            {orders.length === 0 ? (
              <p className="NoOrdersMessage">Aucune commande pour le moment.</p>
            ) : (
              orders.map((order) => (
                <article key={order.id} className="OrderCard">
                  <div className="OrderTop">
                    <h3>{order.numero}</h3>
                    <span
                      className={`Status ${order.statut.replaceAll(" ", "-")}`}
                    >
                      {order.statut}
                    </span>
                  </div>

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
                    <strong>Personnes :</strong> {order.personnes}
                  </p>

                  {order.adresse && (
                    <p>
                      <strong>Adresse :</strong> {order.adresse}
                    </p>
                  )}

                  <p>
                    <strong>Prix menu :</strong> {order.prixMenu}
                  </p>

                  <p>
                    <strong>Livraison :</strong> {order.prixLivraison}
                  </p>

                  <p>
                    <strong>Total :</strong> {order.total}
                  </p>

                  <div className="OrderActions">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOrder(order);
                        setModalType("detail");
                      }}
                    >
                      Détail
                    </button>

                    {order.statut === "en attente" && (
                      <>
                        <button type="button">Modifier</button>
                        <button
                          type="button"
                          className="CancelButton"
                          onClick={() => {
                            setSelectedOrder(order);
                            setModalType("delete");
                          }}
                        >
                          Annuler
                        </button>
                      </>
                    )}

                    {order.statut !== "en attente" && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrder(order);
                          setModalType("suivi");
                        }}
                      >
                        Suivi
                      </button>
                    )}

                    {order.statut === "terminée" && (
                      <button
                        type="button"
                        className="ReviewButton"
                        onClick={() => {
                          setSelectedOrder(order);
                          setModalType("review");
                        }}
                      >
                        Donner un avis
                      </button>
                    )}
                  </div>

                  {order.suivi && order.suivi.length > 0 && (
                    <div className="TrackingBox">
                      <h4>Suivi de commande</h4>
                      <ul>
                        {order.suivi.map((step: any, index: number) => (
                          <li key={index}>
                            <strong>{step.status}</strong>
                            <br />
                            <span>
                              Le {step.date} à {step.heure}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </div>
      </section>
      {selectedOrder && modalType && (
        <div className="AccountModalOverlay">
          <div className="AccountModal">
            <button
              type="button"
              className="AccountModalClose"
              onClick={() => {
                setSelectedOrder(null);
                setModalType(null);
              }}
            >
              ×
            </button>

            {modalType === "detail" && (
              <>
                <h2>Détail de la commande</h2>
                <p>
                  <strong>Numéro :</strong> {selectedOrder.numero}
                </p>
                <p>
                  <strong>Menu :</strong> {selectedOrder.menu}
                </p>
                <p>
                  <strong>Date :</strong> {selectedOrder.date}
                </p>
                <p>
                  <strong>Heure :</strong> {selectedOrder.heure}
                </p>
                <p>
                  <strong>Personnes :</strong> {selectedOrder.personnes}
                </p>
                <p>
                  <strong>Prix menu :</strong> {selectedOrder.prixMenu}
                </p>
                <p>
                  <strong>Livraison :</strong> {selectedOrder.prixLivraison}
                </p>
                <p>
                  <strong>Total :</strong> {selectedOrder.total}
                </p>
                <p>
                  <strong>Statut :</strong> {selectedOrder.statut}
                </p>
              </>
            )}

            {modalType === "suivi" && (
              <>
                <h2>Suivi de commande</h2>
                <ul className="ModalTrackingList">
                  {selectedOrder.suivi.map((step: any, index: number) => (
                    <li key={index}>
                      <strong>{step.status}</strong>
                      <br />
                      <span>
                        Le {step.date} à {step.heure}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {modalType === "delete" && (
              <>
                <h2>Annuler la commande</h2>
                <p>
                  Êtes-vous sûr de vouloir supprimer votre commande{" "}
                  <strong>{selectedOrder.numero}</strong> ?
                </p>

                <div className="ModalActions">
                  <button
                    type="button"
                    className="CancelButton"
                    onClick={handleDeleteOrder}
                  >
                    Oui, supprimer
                  </button>

                  <button
                    type="button"
                    className="AccountButton"
                    onClick={() => {
                      setSelectedOrder(null);
                      setModalType(null);
                    }}
                  >
                    Non, conserver
                  </button>
                </div>
              </>
            )}
            {modalType === "review" && (
              <>
                <h2>Donner un avis</h2>

                <p>
                  Votre commande <strong>{selectedOrder.numero}</strong> est
                  terminée.
                </p>

                <div className="ReviewForm">
                  <label>Note</label>

                  <select
                    value={reviewNote}
                    onChange={(e) => setReviewNote(Number(e.target.value))}
                  >
                    <option value={1}>1 ⭐</option>
                    <option value={2}>2 ⭐</option>
                    <option value={3}>3 ⭐</option>
                    <option value={4}>4 ⭐</option>
                    <option value={5}>5 ⭐</option>
                  </select>

                  <label>Commentaire</label>

                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Votre avis..."
                  />

                  <div className="ModalActions">
                    <button
                      type="button"
                      className="ReviewButton"
                      onClick={handleReviewSubmit}
                    >
                      Envoyer
                    </button>

                    <button
                      type="button"
                      className="AccountButton"
                      onClick={() => {
                        setSelectedOrder(null);
                        setModalType(null);
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
