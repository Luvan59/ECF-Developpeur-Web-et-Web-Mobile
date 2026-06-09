"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "../employee/employee.css";
import "./admin.css";

export default function AdminPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  const [employeeForm, setEmployeeForm] = useState({
    email: "",
    password: "",
    prenom: "",
    nom: "",
  });

  const [filters, setFilters] = useState({
    menuId: "",
    startDate: "",
    endDate: "",
  });

  const displayedStats = filters.menuId
    ? stats
    : menus.map((menu) => {
        const stat = stats.find((item) => item.menuId === menu.id);

        return {
          menuId: menu.id,
          menuTitre: menu.titre,
          nombreCommandes: stat?.nombreCommandes || 0,
          chiffreAffaires: stat?.chiffreAffaires || 0,
        };
      });

  const loadEmployees = async () => {
    const response = await fetch("/api/admin/employees");
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    setEmployees(data);
  };

  const loadMenus = async () => {
    const response = await fetch("/api/employee/menus");
    const data = await response.json();

    if (!response.ok) {
      toast.error("Erreur lors du chargement des menus.");
      return;
    }

    setMenus(data);
  };

  const loadStats = async () => {
    const params = new URLSearchParams();

    if (filters.menuId) params.append("menuId", filters.menuId);
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);

    const response = await fetch(`/api/admin/stats?${params.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    setStats(data);
  };

  useEffect(() => {
    loadEmployees();
    loadMenus();
    loadStats();
  }, []);

  const handleCreateEmployee = async () => {
    const response = await fetch("/api/admin/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeForm),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    toast.success(data.message);

    setEmployeeForm({
      email: "",
      password: "",
      prenom: "",
      nom: "",
    });

    loadEmployees();
  };

  const handleToggleEmployee = async (employee: any) => {
    const response = await fetch(`/api/admin/employees/${employee.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actif: !employee.actif,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message);
      return;
    }

    toast.success(data.message);
    loadEmployees();
  };

  const totalCommandes = displayedStats.reduce(
    (total, stat) => total + stat.nombreCommandes,
    0,
  );

  const totalCA = displayedStats.reduce(
    (total, stat) => total + stat.chiffreAffaires,
    0,
  );

  const maxCommandes =
    displayedStats.length > 0
      ? Math.max(...displayedStats.map((stat) => stat.nombreCommandes), 1)
      : 1;

  return (
    <main className="AdminPage">
      <section className="AdminHero">
        <div>
          <span className="AdminBadge">Administration</span>
          <h1>Espace administrateur</h1>
          <p>
            Gérez les employés, consultez les statistiques NoSQL et suivez les
            performances des menus.
          </p>
        </div>
      </section>

      <section className="AdminKpiGrid">
        <article className="AdminKpiCard">
          <span>Commandes analysées</span>
          <strong>{totalCommandes}</strong>
        </article>

        <article className="AdminKpiCard">
          <span>Chiffre d'affaires</span>
          <strong>{totalCA.toFixed(2)} €</strong>
        </article>

        <article className="AdminKpiCard">
          <span>Menus suivis</span>
          <strong>{stats.length}</strong>
        </article>

        <article className="AdminKpiCard">
          <span>Employés</span>
          <strong>{employees.length}</strong>
        </article>
      </section>

      <section className="AdminPanel">
        <div className="AdminPanelHeader">
          <div>
            <h2>Statistiques des menus</h2>
            <p>Données issues de la base NoSQL.</p>
          </div>
        </div>

        <div className="AdminFilters">
          <div className="AdminField">
            <label>Menu</label>
            <select
              value={filters.menuId}
              onChange={(e) =>
                setFilters({ ...filters, menuId: e.target.value })
              }
            >
              <option value="">Tous les menus</option>

              {menus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.titre}
                </option>
              ))}
            </select>
          </div>

          <div className="AdminField">
            <label>Date début</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
            />
          </div>

          <div className="AdminField">
            <label>Date fin</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
            />
          </div>

          <button
            type="button"
            className="AdminPrimaryButton"
            onClick={loadStats}
          >
            Appliquer
          </button>
        </div>

        <div className="AdminStatsList">
          {displayedStats.length === 0 ? (
            <p className="AdminEmpty">Aucune statistique disponible.</p>
          ) : (
            displayedStats.map((stat) => (
              <article key={stat.menuId} className="AdminStatCard">
                <div className="AdminStatContent">
                  <h3>{stat.menuTitre}</h3>
                  <p>{stat.nombreCommandes} commande(s)</p>
                  <strong>{stat.chiffreAffaires.toFixed(2)} €</strong>
                </div>

                <div className="AdminBarArea">
                  <div className="AdminBarInfo">
                    <span>Volume de commandes</span>
                    <span>{stat.nombreCommandes}</span>
                  </div>

                  <div className="AdminBarWrapper">
                    <div
                      className="AdminBar"
                      style={{
                        width: `${(stat.nombreCommandes / maxCommandes) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="AdminTwoColumns">
        <article className="AdminPanel">
          <div className="AdminPanelHeader">
            <div>
              <h2>Créer un employé</h2>
              <p>Le compte créé aura le rôle employé.</p>
            </div>
          </div>

          <div className="AdminFormGrid">
            <div className="AdminField">
              <label>Prénom</label>
              <input
                value={employeeForm.prenom}
                onChange={(e) =>
                  setEmployeeForm({
                    ...employeeForm,
                    prenom: e.target.value,
                  })
                }
              />
            </div>

            <div className="AdminField">
              <label>Nom</label>
              <input
                value={employeeForm.nom}
                onChange={(e) =>
                  setEmployeeForm({
                    ...employeeForm,
                    nom: e.target.value,
                  })
                }
              />
            </div>

            <div className="AdminField AdminFieldFull">
              <label>Email</label>
              <input
                type="email"
                value={employeeForm.email}
                onChange={(e) =>
                  setEmployeeForm({
                    ...employeeForm,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="AdminField AdminFieldFull">
              <label>Mot de passe temporaire</label>
              <input
                type="password"
                value={employeeForm.password}
                onChange={(e) =>
                  setEmployeeForm({
                    ...employeeForm,
                    password: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <button
            type="button"
            className="AdminPrimaryButton AdminFullButton"
            onClick={handleCreateEmployee}
          >
            Créer l'employé
          </button>
        </article>

        <article className="AdminPanel">
          <div className="AdminPanelHeader">
            <div>
              <h2>Comptes employés</h2>
              <p>Désactivez un compte en cas de départ.</p>
            </div>
          </div>

          <div className="AdminEmployeeList">
            {employees.map((employee) => (
              <div key={employee.id} className="AdminEmployeeCard">
                <div>
                  <h3>
                    {employee.prenom} {employee.nom}
                  </h3>
                  <p>{employee.email}</p>
                </div>

                <div className="AdminEmployeeActions">
                  <span
                    className={
                      employee.actif
                        ? "AdminStatus Active"
                        : "AdminStatus Disabled"
                    }
                  >
                    {employee.actif ? "Actif" : "Désactivé"}
                  </span>

                  <button
                    type="button"
                    className={
                      employee.actif
                        ? "AdminDangerButton"
                        : "AdminSecondaryButton"
                    }
                    onClick={() => handleToggleEmployee(employee)}
                  >
                    {employee.actif ? "Désactiver" : "Réactiver"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
