-- CreateTable
CREATE TABLE "Role" (
    "role_id" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "Utilisateur" (
    "utilisateur_id" SERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "prenom" VARCHAR(50) NOT NULL,
    "nom" VARCHAR(50) NOT NULL,
    "telephone" VARCHAR(50) NOT NULL,
    "ville" VARCHAR(50) NOT NULL,
    "pays" VARCHAR(50) NOT NULL,
    "adresse_postale" VARCHAR(50) NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("utilisateur_id")
);

-- CreateTable
CREATE TABLE "Avis" (
    "avis_id" SERIAL NOT NULL,
    "note" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "statut" VARCHAR(50) NOT NULL,
    "utilisateur_id" INTEGER NOT NULL,

    CONSTRAINT "Avis_pkey" PRIMARY KEY ("avis_id")
);

-- CreateTable
CREATE TABLE "Commande" (
    "commande_id" SERIAL NOT NULL,
    "numero_commande" VARCHAR(50) NOT NULL,
    "date_commande" TIMESTAMP(3) NOT NULL,
    "date_prestation" TIMESTAMP(3) NOT NULL,
    "heure_livraison" VARCHAR(50) NOT NULL,
    "prix_menu" DOUBLE PRECISION NOT NULL,
    "nombre_personne" INTEGER NOT NULL,
    "prix_livraison" DOUBLE PRECISION NOT NULL,
    "statut" VARCHAR(50) NOT NULL,
    "pret_materiel" BOOLEAN NOT NULL,
    "restitution_materiel" BOOLEAN NOT NULL,
    "utilisateur_id" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,

    CONSTRAINT "Commande_pkey" PRIMARY KEY ("commande_id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "menu_id" SERIAL NOT NULL,
    "titre" VARCHAR(50) NOT NULL,
    "nombre_personne_minimum" INTEGER NOT NULL,
    "prix_par_personne" DOUBLE PRECISION NOT NULL,
    "regime" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "quantite_restante" INTEGER NOT NULL,
    "regime_id" INTEGER NOT NULL,
    "theme_id" INTEGER NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("menu_id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "theme_id" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("theme_id")
);

-- CreateTable
CREATE TABLE "Regime" (
    "regime_id" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,

    CONSTRAINT "Regime_pkey" PRIMARY KEY ("regime_id")
);

-- CreateTable
CREATE TABLE "Plat" (
    "plat_id" SERIAL NOT NULL,
    "titre_plat" VARCHAR(50) NOT NULL,
    "photo" BYTEA,

    CONSTRAINT "Plat_pkey" PRIMARY KEY ("plat_id")
);

-- CreateTable
CREATE TABLE "MenuPlat" (
    "menu_id" INTEGER NOT NULL,
    "plat_id" INTEGER NOT NULL,

    CONSTRAINT "MenuPlat_pkey" PRIMARY KEY ("menu_id","plat_id")
);

-- CreateTable
CREATE TABLE "Allergene" (
    "allergene_id" SERIAL NOT NULL,
    "libelle" VARCHAR(50) NOT NULL,

    CONSTRAINT "Allergene_pkey" PRIMARY KEY ("allergene_id")
);

-- CreateTable
CREATE TABLE "PlatAllergene" (
    "plat_id" INTEGER NOT NULL,
    "allergene_id" INTEGER NOT NULL,

    CONSTRAINT "PlatAllergene_pkey" PRIMARY KEY ("plat_id","allergene_id")
);

-- CreateTable
CREATE TABLE "Horaire" (
    "horaire_id" SERIAL NOT NULL,
    "jour" VARCHAR(50) NOT NULL,
    "heure_ouverture" VARCHAR(50) NOT NULL,
    "heure_fermeture" VARCHAR(50) NOT NULL,

    CONSTRAINT "Horaire_pkey" PRIMARY KEY ("horaire_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Commande_numero_commande_key" ON "Commande"("numero_commande");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("utilisateur_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "Utilisateur"("utilisateur_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("menu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_regime_id_fkey" FOREIGN KEY ("regime_id") REFERENCES "Regime"("regime_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "Theme"("theme_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuPlat" ADD CONSTRAINT "MenuPlat_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuPlat" ADD CONSTRAINT "MenuPlat_plat_id_fkey" FOREIGN KEY ("plat_id") REFERENCES "Plat"("plat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatAllergene" ADD CONSTRAINT "PlatAllergene_plat_id_fkey" FOREIGN KEY ("plat_id") REFERENCES "Plat"("plat_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatAllergene" ADD CONSTRAINT "PlatAllergene_allergene_id_fkey" FOREIGN KEY ("allergene_id") REFERENCES "Allergene"("allergene_id") ON DELETE CASCADE ON UPDATE CASCADE;
