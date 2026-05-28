export const SCHOOL = {
  name: "Euro-Permis Sarcelles",
  phone: "01 34 29 01 54",
  phoneHref: "tel:+33134290154",
  address: "56-58 Avenue Paul Valéry, 95200 Sarcelles",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=56-58+Avenue+Paul+Val%C3%A9ry+95200+Sarcelles",
  hours: [
    { day: "Lundi", time: "10:00 – 19:00" },
    { day: "Mardi", time: "10:00 – 19:00" },
    { day: "Mercredi", time: "10:00 – 19:00" },
    { day: "Jeudi", time: "10:00 – 19:00" },
    { day: "Vendredi", time: "10:00 – 19:00" },
    { day: "Samedi", time: "10:00 – 17:00" },
    { day: "Dimanche", time: "Fermé" },
  ],
};

export const PRICING = [
  { id: "b20", title: "Permis B Manuel — 20h", price: 999, badge: "Le plus choisi" },
  { id: "b30", title: "Permis B Manuel — 30h", price: 1399 },
  { id: "auto", title: "Permis B Automatique — 13h", price: 899 },
  { id: "code", title: "Forfait Code en illimité", price: 199 },
  { id: "extra", title: "Heure supplémentaire", price: 60 },
];

export const STUDENT = {
  username: "eleve_jean",
  fullName: "Jean Dupont",
  neph: "0123456789",
  hoursDone: 14,
  hoursTotal: 20,
  balance: 240,
  nextLesson: {
    date: "Vendredi 30 mai",
    time: "14:00 — 16:00",
    instructor: "Karim B.",
    place: "Agence Sarcelles",
  },
  upcoming: [
    { date: "Ven. 30/05", time: "14:00", instructor: "Karim B.", type: "Conduite" },
    { date: "Lun. 02/06", time: "10:00", instructor: "Karim B.", type: "Conduite" },
    { date: "Mer. 04/06", time: "16:00", instructor: "Sonia M.", type: "Autoroute" },
    { date: "Sam. 07/06", time: "09:00", instructor: "Karim B.", type: "Examen blanc" },
  ],
  skills: [
    { name: "Démarrage / arrêt", done: true },
    { name: "Carrefours", done: true },
    { name: "Ronds-points", done: true },
    { name: "Insertion autoroute", done: false },
    { name: "Créneau", done: false },
    { name: "Point de patinage", done: false },
  ],
};

export const INSTRUCTOR = {
  username: "moniteur_karim",
  fullName: "Karim Benali",
  today: [
    { id: "l1", time: "08:00 – 10:00", student: "Jean Dupont", type: "Conduite", status: "done" },
    { id: "l2", time: "10:00 – 12:00", student: "Aïcha Traoré", type: "Manœuvres", status: "done" },
    { id: "l3", time: "14:00 – 16:00", student: "Jean Dupont", type: "Conduite", status: "current" },
    { id: "l4", time: "16:00 – 18:00", student: "Marc Lefèvre", type: "Examen blanc", status: "upcoming" },
    { id: "l5", time: "18:00 – 19:00", student: "Sara El M.", type: "Code", status: "upcoming" },
  ],
  skills: [
    "Démarrage / arrêt",
    "Carrefours",
    "Ronds-points",
    "Insertion autoroute",
    "Créneau / stationnement",
    "Point de patinage",
    "Conduite de nuit",
    "Conditions dégradées",
  ],
};

export const INSTRUCTORS = ["Karim B.", "Sonia M.", "David L."];

type Lesson = { time: string; student: string; type: string };
export const PLANNING: Record<string, Lesson[]> = {
  "Karim B.": [
    { time: "08:00", student: "Jean Dupont", type: "Conduite" },
    { time: "10:00", student: "Aïcha Traoré", type: "Manœuvres" },
    { time: "14:00", student: "Jean Dupont", type: "Conduite" },
    { time: "16:00", student: "Marc Lefèvre", type: "Examen blanc" },
  ],
  "Sonia M.": [
    { time: "09:00", student: "Léa Martin", type: "Conduite" },
    { time: "11:00", student: "Yanis K.", type: "Autoroute" },
    { time: "15:00", student: "Inès B.", type: "Conduite" },
  ],
  "David L.": [
    { time: "08:00", student: "Hugo P.", type: "Conduite" },
    { time: "13:00", student: "Sara El M.", type: "Code" },
    { time: "17:00", student: "Nora F.", type: "Conduite" },
  ],
};
