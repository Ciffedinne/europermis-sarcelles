// Simulation d'une intégration API Rapido (Codes Rousseau).
// Aucune requête réseau réelle n'est effectuée : on renvoie une liste
// fictive de nouveaux élèves au format ImportedStudent.

export type RapidoStudent = {
  civilite: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  neph: string;
  adresse: string;
  codePostal: string;
  ville: string;
  pays: string;
  telephone: string;
  email: string;
  departementNaissance: string;
  paysNaissance: string;
  datePremierPermis: string;
};

export type RapidoConfig = {
  apiKey: string;
  etablissementId: string;
};

const MOCK_POOL: RapidoStudent[] = [
  {
    civilite: "M.", nom: "Benhamou", prenom: "Idriss",
    dateNaissance: "14/02/2005", lieuNaissance: "Sarcelles",
    neph: "0998877665", adresse: "12 rue de Paris", codePostal: "95200",
    ville: "Sarcelles", pays: "France", telephone: "0612340001",
    email: "idriss.benhamou@example.fr", departementNaissance: "95",
    paysNaissance: "France", datePremierPermis: "",
  },
  {
    civilite: "Mme", nom: "Diallo", prenom: "Fatou",
    dateNaissance: "22/08/2004", lieuNaissance: "Garges-lès-Gonesse",
    neph: "0887766554", adresse: "5 av. Voltaire", codePostal: "95140",
    ville: "Garges-lès-Gonesse", pays: "France", telephone: "0612340002",
    email: "fatou.diallo@example.fr", departementNaissance: "95",
    paysNaissance: "France", datePremierPermis: "",
  },
  {
    civilite: "M.", nom: "Nguyen", prenom: "Tuan",
    dateNaissance: "03/12/2003", lieuNaissance: "Paris",
    neph: "0776655443", adresse: "8 rue Lafayette", codePostal: "75010",
    ville: "Paris", pays: "France", telephone: "0612340003",
    email: "tuan.nguyen@example.fr", departementNaissance: "75",
    paysNaissance: "France", datePremierPermis: "",
  },
  {
    civilite: "Mme", nom: "Da Silva", prenom: "Mariana",
    dateNaissance: "19/05/2006", lieuNaissance: "Villiers-le-Bel",
    neph: "0665544332", adresse: "21 rue des Lilas", codePostal: "95400",
    ville: "Villiers-le-Bel", pays: "France", telephone: "0612340004",
    email: "mariana.dasilva@example.fr", departementNaissance: "95",
    paysNaissance: "France", datePremierPermis: "",
  },
];

export async function fetchRapidoStudents(
  config: RapidoConfig,
): Promise<RapidoStudent[]> {
  // Simulation d'une latence réseau
  await new Promise((r) => setTimeout(r, 700));
  if (!config.apiKey.trim() || !config.etablissementId.trim()) {
    throw new Error("Clé API et identifiant établissement requis.");
  }
  // On retourne un sous-ensemble aléatoire (2-4 élèves)
  const n = 2 + Math.floor(Math.random() * (MOCK_POOL.length - 1));
  const shuffled = [...MOCK_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
