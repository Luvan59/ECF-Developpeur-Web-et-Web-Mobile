# Vite & Gourmand — Installation et déploiement local

## 1. Présentation du projet

**Vite & Gourmand** est une application web de traiteur développée avec **Next.js**, **TypeScript**, **Prisma**, **PostgreSQL** et **MongoDB**.

L’application permet :

- aux visiteurs de consulter les menus ;
- aux utilisateurs inscrits de passer commande ;
- aux employés de gérer les menus, les commandes, les horaires et les avis ;
- à l’administrateur de gérer les employés et de consulter les statistiques NoSQL.

---

## 2. Prérequis

Avant d’installer le projet, vérifier que les outils suivants sont installés :

- Node.js
- pnpm
- PostgreSQL
- MongoDB ou MongoDB Atlas
- Git

Vérifier les versions :

```bash
node -v
pnpm -v
git --version
```

---

## 3. Récupération du projet

Cloner le dépôt GitHub :

```bash
git clone https://github.com/Luvan59/ECF-Developpeur-Web-et-Web-Mobile.git
```

Entrer dans le dossier du projet :

```bash
cd my-app
```

Installer les dépendances :

```bash
pnpm install
```

---

## 4. Configuration des variables d’environnement

Créer un fichier `.env` à la racine du projet.

Exemple de configuration :

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/vite_gourmand"

JWT_SECRET="une_phrase_secrete_longue"

APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

MONGODB_URI="mongodb://localhost:27017"
MONGODB_DB="vite_gourmand_nosql"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="votre_email@gmail.com"
SMTP_PASSWORD="mot_de_passe_application_google"
SMTP_FROM="Vite & Gourmand <votre_email@gmail.com>"

CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"
```

Les variables importantes sont :

- `DATABASE_URL` : connexion à la base PostgreSQL ;
- `JWT_SECRET` : clé utilisée pour sécuriser les tokens de connexion ;
- `MONGODB_URI` : connexion à MongoDB pour les statistiques NoSQL ;
- `SMTP_*` : configuration de l’envoi des mails ;
- `CLOUDINARY_*` : configuration de l’hébergement des images.

---

## 5. Initialisation de la base PostgreSQL

Générer le client Prisma :

```bash
pnpm prisma generate
```

Appliquer les migrations :

```bash
pnpm prisma migrate dev
```

Lancer le seed pour créer les rôles et le compte administrateur :

```bash
pnpm prisma db seed
```

Compte administrateur par défaut :

```txt
Email : admin@vitegourmand.fr
Mot de passe : Admin123!
```

---

## 6. Configuration du seed Prisma

Le fichier `prisma/seed.ts` permet de créer les données de base nécessaires au fonctionnement de l’application :

- rôle `USER` ;
- rôle `EMPLOYEE` ;
- rôle `ADMIN` ;
- compte administrateur.

Le fichier `package.json` doit contenir :

```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

Si `tsx` n’est pas installé :

```bash
pnpm add -D tsx
```

---

## 7. Lancement du projet en local

Démarrer le serveur de développement :

```bash
pnpm dev
```

L’application sera disponible à l’adresse :

```txt
http://localhost:3000
```

---

## 8. Vérification du bon fonctionnement

Après le lancement local, vérifier les pages principales :

```txt
http://localhost:3000
http://localhost:3000/menu
http://localhost:3000/login
http://localhost:3000/register
http://localhost:3000/account
http://localhost:3000/employee
http://localhost:3000/admin
```

Pour accéder à l’espace administrateur :

```txt
Email : admin@vitegourmand.fr
Mot de passe : Admin123!
```

---

## 9. Build de production local

Avant tout déploiement, vérifier que le projet compile correctement :

```bash
pnpm run build
```

Si le build réussit, lancer la version de production locale :

```bash
pnpm start
```

Le site sera accessible sur :

```txt
http://localhost:3000
```

---

## 10. Commandes utiles Prisma

Ouvrir Prisma Studio :

```bash
pnpm prisma studio
```

Créer une nouvelle migration après modification du schéma :

```bash
pnpm prisma migrate dev --name nom_de_la_migration
```

Générer le client Prisma :

```bash
pnpm prisma generate
```

Relancer le seed :

```bash
pnpm prisma db seed
```

---

## 11. MongoDB / NoSQL

MongoDB est utilisé pour stocker les statistiques des commandes.

En local, il est possible d’utiliser :

```env
MONGODB_URI="mongodb://localhost:27017"
MONGODB_DB="vite_gourmand_nosql"
```

La base et les collections MongoDB sont créées automatiquement lorsque l’application écrit une donnée.

Exemple de collection utilisée :

```txt
order_stats
```

---

## 12. Cloudinary

Cloudinary est utilisé pour stocker les images des menus.

Cela permet d’éviter d’enregistrer les images directement dans le dossier `public/uploads`, ce qui n’est pas adapté à un environnement de production.

Variables nécessaires :

```env
CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"
```

---

## 13. Envoi de mails

L’application utilise un service SMTP pour envoyer les mails, notamment pour :

- la réinitialisation de mot de passe ;
- les notifications de commande.

Avec Gmail, il faut utiliser un **mot de passe d’application Google**, et non le mot de passe classique du compte Gmail.

Variables nécessaires :

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="votre_email@gmail.com"
SMTP_PASSWORD="mot_de_passe_application_google"
SMTP_FROM="Vite & Gourmand <votre_email@gmail.com>"
```

---

## 14. Résumé des commandes principales

```bash
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma db seed
pnpm dev
```

Pour tester le build :

```bash
pnpm run build
pnpm start
```

---

## 15. Identifiants de test

Compte administrateur :

```txt
Email : admin@vitegourmand.fr
Mot de passe : Admin123!
```

