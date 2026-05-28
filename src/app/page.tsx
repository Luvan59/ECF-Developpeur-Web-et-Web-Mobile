import Image from "next/image";
import Buttonfill from "@/components/buttonfill/buttonfill";
import { comments } from "@/data/comments";

export default function Home() {
  const validatedComments = comments
    .filter((comment) => comment.validated)
    .slice(0, 4);

  return (
    <div className="h-full font-family-Inter">
      <div className="relative w-full h-64">
        <Image
          src="/assets/RestaurantECF.jpg"
          alt="Restaurant Vite & Gourmand"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <main className="">
        <div className="CompagnyComment">
          <div className="AboutCompagny">
            <h1>A propos de nous</h1>
            <p>
              Bienvenue chez Vite & Gourmand, une entreprise familiale créée il
              y a plus de 25 ans à Bordeaux par Julie et José. Passionnés par la
              restauration et les moments de partage, nous proposons des
              prestations adaptées à tous vos événements : repas en famille,
              fêtes de Noël, Pâques, anniversaires ou encore événements privés.
            </p>
            <p>
              Nos menus évoluent régulièrement afin de vous offrir des plats
              variés, préparés avec soin et adaptés à chaque occasion.
              Aujourd’hui, nous souhaitons moderniser notre activité grâce à une
              application web permettant à tous de découvrir plus facilement nos
              menus et nos services.
            </p>{" "}
            <p>
              {" "}
              Chez Vite & Gourmand, notre priorité est de vous offrir une
              cuisine conviviale, de qualité et un accompagnement professionnel
              pour faire de chaque événement un moment unique.
            </p>
          </div>
          <div className="CompanyDescription">
            <h1>Une equipe professionnelle a votre service</h1>
            <p>
              Depuis plus de 25 ans, Julie et José mettent leur savoir-faire et
              leur passion au service de vos événements à Bordeaux. Grâce à leur
              expérience, ils accompagnent chaque client avec sérieux, écoute et
              attention afin de proposer des prestations adaptées à chaque
              occasion.
            </p>
            <p>
              Chez Vite & Gourmand, chaque menu est préparé avec soin pour
              garantir qualité, convivialité et satisfaction. L’entreprise
              accorde une grande importance à la fraîcheur des produits, au
              respect des demandes des clients et à la bonne organisation de
              chaque prestation.
            </p>
            <p>Le professionnalisme de l’équipe repose sur :</p>
            <ul className="list-disc pl-5">
              <li>plus de 25 ans d’expérience,</li>
              <li>une relation de confiance avec les clients,</li>
              <li>des menus régulièrement renouvelés,</li>
              <li>une organisation sérieuse et réactive,</li>
              <li>une cuisine préparée avec passion et exigence.</li>
            </ul>
            <p>
              Julie et José ont à cœur de faire de chaque événement un moment
              chaleureux et réussi.
            </p>
          </div>
        </div>
        <div className="ClientComments">
          <div className="CommentBoard">
            <h1>Avis Clients</h1>
            <div className="CommentsGrid">
              {validatedComments.map((comment) => (
                <div key={comment.id} className="ClientCard">
                  {comment.user} {comment.date}
                  <div className="CommentSection">
                    <p>{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <Buttonfill text="Tous les Messages" fontsize="1.375rem" />
          </div>
        </div>
      </main>
    </div>
  );
}
