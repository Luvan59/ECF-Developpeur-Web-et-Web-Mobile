export const menus = [
  {
    id: 1,
    title: "Menu Noël Prestige",
    description:
      "Un menu festif composé de produits raffinés pour vos repas de fin d’année.",
    theme: "Noël",
    regime: "Classique",
    minPeople: 6,
    price: 39.99,
    stock: 5,

    presentationImages: [
      "https://images.unsplash.com/photo-1544025162-d76694265947",
      "https://images.unsplash.com/photo-1516684732162-798a0062be99",
      "https://images.unsplash.com/photo-1559847844-5315695dadae",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    ],

    images: [
      "https://images.unsplash.com/photo-1547592180-85f173990554",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de",
    ],

    dishes: {
      starter: "Foie gras maison",
      main: "Magret de canard sauce miel",
      dessert: "Bûche chocolat noisette",
    },

    allergens: ["Gluten", "Lactose"],

    conditions: "Commande minimum 7 jours avant la prestation.",
  },

  {
    id: 2,
    title: "Menu Vegan Green",
    description:
      "Un menu vegan moderne et gourmand préparé avec des produits frais.",
    theme: "Classique",
    regime: "Vegan",
    minPeople: 4,
    price: 24.99,
    stock: 12,

    presentationImages: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    ],

    images: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc",
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
    ],

    dishes: {
      starter: "Houmous et légumes grillés",
      main: "Curry de légumes coco",
      dessert: "Mousse chocolat vegan",
    },

    allergens: ["Fruits à coque"],

    conditions: "Conserver au frais après livraison.",
  },

  {
    id: 3,
    title: "Menu Italien",
    description:
      "Une ambiance italienne authentique pour vos événements en famille.",
    theme: "Événement",
    regime: "Classique",
    minPeople: 5,
    price: 29.99,
    stock: 8,

    presentationImages: [
      "https://images.unsplash.com/photo-1513104890138-7c749659a591",
      "https://images.unsplash.com/photo-1525755662778-989d0524087e",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
    ],

    images: [
      "https://images.unsplash.com/photo-1498579809087-ef1e558fd1da",
      "https://images.unsplash.com/photo-1525755662778-989d0524087e",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
    ],

    dishes: {
      starter: "Bruschettas tomates basilic",
      main: "Lasagnes maison",
      dessert: "Tiramisu café",
    },

    allergens: ["Gluten", "Lactose", "Œufs"],

    conditions: "Prévoir un espace de stockage réfrigéré.",
  },

  {
    id: 4,
    title: "Menu Pâques Tradition",
    description:
      "Menu familial traditionnel autour de l’agneau et des saveurs printanières. Menu familial traditionnel autour de l’agneau et des saveurs printanières.",
    theme: "Pâques",
    regime: "Classique",
    minPeople: 8,
    price: 44.99,
    stock: 4,

    presentationImages: [
      "https://images.unsplash.com/photo-1488477181946-6428a0291777",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff",
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e",
      "https://images.unsplash.com/photo-1551024601-bec78aea704b",
    ],

    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      "https://images.unsplash.com/photo-1547592180-85f173990554",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
    ],

    dishes: {
      starter: "Velouté d’asperges",
      main: "Gigot d’agneau rôti",
      dessert: "Tarte citron meringuée",
    },

    allergens: ["Gluten", "Lactose"],

    conditions: "Commande minimum 10 jours avant livraison.",
  },

  {
    id: 5,
    title: "Menu Cocktail Premium",
    description:
      "Idéal pour les soirées professionnelles et cocktails dinatoires.",
    theme: "Événement",
    regime: "Végétarien",
    minPeople: 10,
    price: 54.99,
    stock: 3,

    presentationImages: [
      "https://images.unsplash.com/photo-1559339352-11d035aa65de",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    ],

    images: [
      "https://images.unsplash.com/photo-1559339352-11d035aa65de",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
    ],

    dishes: {
      starter: "Mini wraps végétariens",
      main: "Buffet tapas gourmet",
      dessert: "Assortiment de mignardises",
    },

    allergens: ["Gluten", "Sésame"],

    conditions: "Le matériel prêté doit être restitué sous 10 jours ouvrés.",
  },
];
