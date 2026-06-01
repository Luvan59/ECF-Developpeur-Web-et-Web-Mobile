import "./mentions-legales.css";

export default function MentionsLegalesPage() {
  return (
    <main className="LegalPage">
      <section className="LegalContainer">
        <h1>Mentions légales</h1>

        <h2>1. Éditeur du site</h2>
        <p>
          Le site Vite & Gourmand est édité dans le cadre d’un projet ECF
          Développeur Web et Web Mobile.
        </p>
        <p>
          Entreprise fictive : Vite & Gourmand
          <br />
          Localisation : Bordeaux, France
          <br />
          Email : vite.gourmand.contact33000@gmail.com
        </p>

        <h2>2. Responsable de publication</h2>
        <p>
          Le responsable de publication est le créateur de l’application dans le
          cadre du projet de formation.
        </p>

        <h2>3. Hébergement</h2>
        <p>
          L’application peut être hébergée sur une plateforme de déploiement web
          telle que Vercel, Render, Railway, Heroku ou tout autre service choisi
          pour la mise en ligne du projet.
        </p>

        <h2>4. Propriété intellectuelle</h2>
        <p>
          Les contenus, textes, interfaces, éléments graphiques et
          fonctionnalités présents sur l’application sont utilisés uniquement
          dans le cadre du projet ECF. Toute reproduction ou réutilisation sans
          autorisation est interdite.
        </p>

        <h2>5. Données personnelles</h2>
        <p>
          L’application collecte certaines données nécessaires à son
          fonctionnement : nom, prénom, adresse email, téléphone, adresse
          postale, commandes et messages de contact.
        </p>
        <p>
          Ces données sont utilisées uniquement pour la gestion des comptes,
          commandes, demandes de contact et échanges avec l’utilisateur.
        </p>

        <h2>6. Sécurité des données</h2>
        <p>
          Les mots de passe ne sont pas stockés en clair. Ils sont sécurisés à
          l’aide d’un mécanisme de hash. L’accès aux espaces sensibles est
          protégé par authentification et par gestion des rôles.
        </p>

        <h2>7. Cookies et session</h2>
        <p>
          L’application utilise un cookie de session afin de maintenir
          l’utilisateur connecté et de sécuriser l’accès aux pages protégées.
        </p>

        <h2>8. Formulaire de contact</h2>
        <p>
          Les informations transmises via le formulaire de contact sont envoyées
          à l’entreprise afin de permettre une réponse à la demande du visiteur.
        </p>

        <h2>9. Limitation de responsabilité</h2>
        <p>
          Le site est réalisé dans un cadre pédagogique. Malgré le soin apporté
          à son développement, des erreurs ou interruptions peuvent survenir.
        </p>

        <h2>10. Contact</h2>
        <p>
          Pour toute demande relative au site ou aux données personnelles :
          vite.gourmand.contact33000@gmail.com
        </p>

        <p className="LegalLastUpdate">Dernière mise à jour : 2026</p>
      </section>
    </main>
  );
}
