import "./conditions-generales.css";

export default function ConditionsGeneralesPage() {
  return (
    <main className="CguPage">
      <section className="CguContainer">
        <h1>Conditions générales d’utilisation</h1>

        <p className="CguIntro">
          Les présentes conditions générales d’utilisation encadrent l’accès et
          l’utilisation de l’application web Vite & Gourmand.
        </p>

        <h2>1. Présentation du service</h2>
        <p>
          Vite & Gourmand est une application permettant aux visiteurs de
          consulter les menus proposés par l’entreprise, de créer un compte, de
          passer commande et de suivre l’état de leurs commandes.
        </p>

        <h2>2. Création de compte</h2>
        <p>
          L’utilisateur doit fournir des informations exactes : nom, prénom,
          adresse email, téléphone, adresse postale et mot de passe sécurisé. Le
          mot de passe doit contenir au minimum 10 caractères, une majuscule,
          une minuscule, un chiffre et un caractère spécial.
        </p>

        <h2>3. Accès aux espaces utilisateurs</h2>
        <p>
          L’application distingue plusieurs rôles : utilisateur, employé et
          administrateur. Chaque rôle possède des droits d’accès spécifiques. Un
          utilisateur ne peut accéder qu’à son espace personnel et à ses
          commandes.
        </p>

        <h2>4. Commandes</h2>
        <p>
          Les commandes sont effectuées à partir d’un menu sélectionné.
          L’utilisateur doit renseigner les informations nécessaires à la
          prestation : adresse, date, heure de livraison et nombre de personnes.
          Le nombre de personnes ne peut pas être inférieur au minimum défini
          pour le menu.
        </p>

        <h2>5. Annulation et modification</h2>
        <p>
          Une commande peut être modifiée ou annulée tant qu’elle n’a pas été
          acceptée par l’équipe Vite & Gourmand. Après acceptation, le suivi de
          commande devient disponible pour l’utilisateur.
        </p>

        <h2>6. Données personnelles</h2>
        <p>
          Les données collectées sont utilisées uniquement pour la gestion des
          comptes, des commandes, des demandes de contact et du suivi client.
          Les mots de passe sont stockés de manière sécurisée sous forme
          chiffrée.
        </p>

        <h2>7. Sécurité</h2>
        <p>
          L’application met en place plusieurs mesures de sécurité :
          authentification par session, mot de passe hashé, vérification des
          rôles, protection des pages sensibles et validation des données côté
          serveur.
        </p>

        <h2>8. Formulaire de contact</h2>
        <p>
          Le visiteur peut contacter l’entreprise via un formulaire dédié. Les
          informations transmises sont utilisées uniquement afin de répondre à
          la demande.
        </p>

        <h2>9. Responsabilité</h2>
        <p>
          Vite & Gourmand s’efforce de maintenir l’application accessible et
          fonctionnelle. Toutefois, l’entreprise ne peut être tenue responsable
          en cas d’interruption temporaire du service ou d’erreur liée à une
          mauvaise utilisation de l’application.
        </p>

        <h2>10. Contact</h2>
        <p>
          Pour toute question concernant l’utilisation de l’application, vous
          pouvez contacter l’entreprise à l’adresse suivante :
          vite.gourmand.contact33000@gmail.com
        </p>

        <p className="CguLastUpdate">Dernière mise à jour : 2026</p>
      </section>
    </main>
  );
}
