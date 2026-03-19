export const initialClients = [
  { id: 1,  nom: "Martin Bernard",    email: "martin.bernard@gmail.com",   telephone: "06 12 34 56 78", adresse: "12 rue de la Paix, 75001 Paris",         cni: true  },
  { id: 2,  nom: "Sophie Leclerc",    email: "sophie.leclerc@hotmail.fr",  telephone: "07 23 45 67 89", adresse: "8 avenue Foch, 69006 Lyon",              cni: true  },
  { id: 3,  nom: "Ahmed Benali",      email: "ahmed.benali@gmail.com",     telephone: "06 34 56 78 90", adresse: "45 bd Gambetta, 13001 Marseille",        cni: false },
  { id: 4,  nom: "Marie Dubois",      email: "marie.dubois@orange.fr",     telephone: "07 45 67 89 01", adresse: "3 rue Nationale, 59000 Lille",           cni: true  },
  { id: 5,  nom: "Pierre Moreau",     email: "pierre.moreau@sfr.fr",       telephone: "06 56 78 90 12", adresse: "27 rue Victor Hugo, 33000 Bordeaux",     cni: true  },
  { id: 6,  nom: "Karim Mansouri",    email: "k.mansouri@gmail.com",       telephone: "06 78 90 12 34", adresse: "14 rue Molière, 06000 Nice",             cni: true  },
  { id: 7,  nom: "Isabelle Petit",    email: "isabelle.petit@laposte.net", telephone: "07 89 01 23 45", adresse: "56 av. de la République, 44000 Nantes",  cni: true  },
]

export const mockVehicles = [
  { id: 1,  plaque: "AB-123-CD", marque: "BMW",          modele: "M3 Competition",  annee: 2022, km: 18500,  carburant: "Essence",  statut: "En stock" },
  { id: 2,  plaque: "EF-456-GH", marque: "Mercedes",     modele: "GLE 400d",        annee: 2021, km: 34000,  carburant: "Diesel",   statut: "En stock" },
  { id: 3,  plaque: "IJ-789-KL", marque: "Porsche",      modele: "Cayenne S",       annee: 2021, km: 22000,  carburant: "Essence",  statut: "En stock" },
  { id: 4,  plaque: "MN-012-OP", marque: "Audi",         modele: "Q8 55 TFSI",      annee: 2022, km: 27000,  carburant: "Essence",  statut: "En stock" },
  { id: 5,  plaque: "QR-345-ST", marque: "Range Rover",  modele: "Sport HSE",       annee: 2020, km: 48000,  carburant: "Diesel",   statut: "En stock" },
  { id: 6,  plaque: "UV-678-WX", marque: "Tesla",        modele: "Model 3 LR",      annee: 2022, km: 28000,  carburant: "Électrique", statut: "En stock" },
  { id: 7,  plaque: "YZ-901-AB", marque: "BMW",          modele: "X5 xDrive40d",   annee: 2021, km: 41000,  carburant: "Diesel",   statut: "En stock" },
  { id: 8,  plaque: "CD-234-EF", marque: "Mercedes",     modele: "Classe C 300",    annee: 2022, km: 19000,  carburant: "Hybride",  statut: "En stock" },
]

export const mockSales = [
  { id: 1,  client: "Martin Bernard",   vehicule: "BMW M3 Competition",     type: "france", statut: "envoye",   date: "18/03/2026" },
  { id: 2,  client: "Sophie Leclerc",   vehicule: "Porsche Cayenne S",      type: "export", statut: "genere",   date: "17/03/2026" },
  { id: 3,  client: "Ahmed Benali",     vehicule: "Mercedes GLE 400d",      type: "import", statut: "en_cours", date: "17/03/2026" },
  { id: 4,  client: "Marie Dubois",     vehicule: "Audi Q8 55 TFSI",        type: "france", statut: "envoye",   date: "16/03/2026" },
  { id: 5,  client: "Pierre Moreau",    vehicule: "Range Rover Sport HSE",  type: "export", statut: "genere",   date: "15/03/2026" },
  { id: 6,  client: "Karim Mansouri",   vehicule: "Tesla Model 3 LR",       type: "france", statut: "en_cours", date: "15/03/2026" },
  { id: 7,  client: "Isabelle Petit",   vehicule: "BMW X5 xDrive40d",       type: "france", statut: "envoye",   date: "14/03/2026" },
  { id: 8,  client: "Lucas Martin",     vehicule: "Mercedes Classe C 300",  type: "france", statut: "genere",   date: "13/03/2026" },
]

export const mockLivreDePolice = [
  // Mars 2026 — en cours
  { id: 1,  dateEntree: "02/03/2026", marque: "BMW",          modele: "M3 Competition",    plaque: "AB-123-CD", vin: "WBS8M9C5XNC000001", prixAchat: 52000, fournisseur: "Manheim Paris",          dateSortie: "18/03/2026", acquereur: "Martin Bernard",  prixCession: 64900, statut: "vendu" },
  { id: 2,  dateEntree: "04/03/2026", marque: "Porsche",      modele: "Cayenne S",         plaque: "EF-456-GH", vin: "WP1AB2AY5LDA00002", prixAchat: 58000, fournisseur: "BCA Stuttgart",          dateSortie: "17/03/2026", acquereur: "Sophie Leclerc",  prixCession: 72400, statut: "vendu" },
  { id: 3,  dateEntree: "05/03/2026", marque: "Mercedes",     modele: "GLE 400d",          plaque: "IJ-789-KL", vin: "W1N1671671A000003", prixAchat: 44500, fournisseur: "Autobiz Pro",            dateSortie: null,           acquereur: null,              prixCession: null,  statut: "stock" },
  { id: 4,  dateEntree: "07/03/2026", marque: "Audi",         modele: "Q8 55 TFSI",        plaque: "MN-012-OP", vin: "WAUZZZF17LD000004", prixAchat: 49800, fournisseur: "Manheim Lyon",           dateSortie: "16/03/2026", acquereur: "Marie Dubois",    prixCession: 61500, statut: "vendu" },
  { id: 5,  dateEntree: "08/03/2026", marque: "Range Rover",  modele: "Sport HSE",         plaque: "QR-345-ST", vin: "SALWA2FE5LA000005", prixAchat: 38200, fournisseur: "BCA Bordeaux",           dateSortie: "15/03/2026", acquereur: "Pierre Moreau",   prixCession: 47800, statut: "vendu" },
  { id: 6,  dateEntree: "10/03/2026", marque: "Tesla",        modele: "Model 3 Long Range", plaque: "UV-678-WX", vin: "5YJ3E1EB9NF000006", prixAchat: 32000, fournisseur: "Particulier",           dateSortie: null,           acquereur: null,              prixCession: null,  statut: "stock" },
  { id: 7,  dateEntree: "11/03/2026", marque: "BMW",          modele: "X5 xDrive40d",     plaque: "YZ-901-AB", vin: "5UXCR6C09N0000007", prixAchat: 42600, fournisseur: "Auto Enchères Paris",    dateSortie: "14/03/2026", acquereur: "Isabelle Petit",  prixCession: 52800, statut: "vendu" },
  { id: 8,  dateEntree: "12/03/2026", marque: "Mercedes",     modele: "Classe C 300e",     plaque: "CD-234-EF", vin: "W1KZF8HB2NW000008", prixAchat: 34900, fournisseur: "Manheim Paris",          dateSortie: null,           acquereur: null,              prixCession: null,  statut: "stock" },
  // Février 2026
  { id: 9,  dateEntree: "03/02/2026", marque: "Porsche",      modele: "Macan GTS",         plaque: "GH-567-IJ", vin: "WP1AF2A52JLB00009", prixAchat: 46000, fournisseur: "BCA Stuttgart",          dateSortie: "22/02/2026", acquereur: "Karim Mansouri",  prixCession: 57600, statut: "vendu" },
  { id: 10, dateEntree: "05/02/2026", marque: "BMW",          modele: "M5 Competition",    plaque: "KL-890-MN", vin: "WBSJF0C58KB000010", prixAchat: 68000, fournisseur: "Manheim Lyon",           dateSortie: "19/02/2026", acquereur: "Ahmed Benali",    prixCession: 84200, statut: "vendu" },
  { id: 11, dateEntree: "07/02/2026", marque: "Lamborghini",  modele: "Urus",              plaque: "OP-123-QR", vin: "ZPBUA1ZL0MLA00011", prixAchat: 148000, fournisseur: "Particulier",           dateSortie: "14/02/2026", acquereur: "Lucas Martin",    prixCession: 178000, statut: "vendu" },
  { id: 12, dateEntree: "10/02/2026", marque: "Audi",         modele: "RS6 Avant",         plaque: "ST-456-UV", vin: "WAUZZZ4G2NN000012", prixAchat: 72000, fournisseur: "Auto Enchères Paris",    dateSortie: "24/02/2026", acquereur: "Marie Dubois",    prixCession: 88400, statut: "vendu" },
  { id: 13, dateEntree: "12/02/2026", marque: "Mercedes",     modele: "AMG GT 63 S",       plaque: "WX-789-YZ", vin: "W1K1771731N000013", prixAchat: 92000, fournisseur: "BCA Paris",              dateSortie: "27/02/2026", acquereur: "Pierre Moreau",   prixCession: 112600, statut: "vendu" },
  { id: 14, dateEntree: "14/02/2026", marque: "Ferrari",      modele: "Roma",              plaque: "AB-012-CD", vin: "ZFF95NJA4N0000014", prixAchat: 185000, fournisseur: "Particulier",           dateSortie: "28/02/2026", acquereur: "Sophie Leclerc",  prixCession: 218000, statut: "vendu" },
  // Janvier 2026
  { id: 15, dateEntree: "06/01/2026", marque: "BMW",          modele: "X7 M60i",           plaque: "EF-345-GH", vin: "5UXCW2C04N0000015", prixAchat: 78000, fournisseur: "Manheim Paris",          dateSortie: "18/01/2026", acquereur: "Isabelle Petit",  prixCession: 94800, statut: "vendu" },
  { id: 16, dateEntree: "08/01/2026", marque: "Porsche",      modele: "Panamera 4S",       plaque: "IJ-678-KL", vin: "WP0AB2A73NL000016", prixAchat: 84000, fournisseur: "Auto Enchères Lyon",     dateSortie: "22/01/2026", acquereur: "Karim Mansouri",  prixCession: 102400, statut: "vendu" },
  { id: 17, dateEntree: "10/01/2026", marque: "Range Rover",  modele: "Autobiography",     plaque: "MN-901-OP", vin: "SALGV2FE6NA000017", prixAchat: 96000, fournisseur: "BCA Bordeaux",           dateSortie: "25/01/2026", acquereur: "Martin Bernard",  prixCession: 118000, statut: "vendu" },
  { id: 18, dateEntree: "13/01/2026", marque: "Tesla",        modele: "Model S Plaid",     plaque: "QR-234-ST", vin: "5YJSA1E48NF000018", prixAchat: 72000, fournisseur: "Particulier",            dateSortie: "28/01/2026", acquereur: "Ahmed Benali",    prixCession: 86400, statut: "vendu" },
  { id: 19, dateEntree: "15/01/2026", marque: "Maserati",     modele: "Levante Trofeo",    plaque: "UV-567-WX", vin: "ZAM57YSX0N0000019", prixAchat: 88000, fournisseur: "Auto Enchères Paris",    dateSortie: "29/01/2026", acquereur: "Marie Dubois",    prixCession: 107600, statut: "vendu" },
  // Décembre 2025
  { id: 20, dateEntree: "05/12/2025", marque: "Bentley",      modele: "Bentayga V8",       plaque: "YZ-890-AB", vin: "SCBCR53W6GC000020", prixAchat: 138000, fournisseur: "BCA Paris",             dateSortie: "14/12/2025", acquereur: "Sophie Leclerc",  prixCession: 162000, statut: "vendu" },
  { id: 21, dateEntree: "08/12/2025", marque: "BMW",          modele: "M8 Gran Coupé",     plaque: "CD-123-EF", vin: "WBSGV0C07NCD00021", prixAchat: 94000, fournisseur: "Manheim Lyon",           dateSortie: "19/12/2025", acquereur: "Pierre Moreau",   prixCession: 114800, statut: "vendu" },
  { id: 22, dateEntree: "10/12/2025", marque: "Audi",         modele: "e-tron GT RS",      plaque: "GH-456-IJ", vin: "WAUZZZF83ND000022", prixAchat: 86000, fournisseur: "Auto Enchères Paris",    dateSortie: "22/12/2025", acquereur: "Isabelle Petit",  prixCession: 104600, statut: "vendu" },
  // Novembre 2025
  { id: 23, dateEntree: "04/11/2025", marque: "Porsche",      modele: "911 Carrera S",     plaque: "KL-789-MN", vin: "WP0AB2A91NS000023", prixAchat: 102000, fournisseur: "Particulier",           dateSortie: "16/11/2025", acquereur: "Karim Mansouri",  prixCession: 124400, statut: "vendu" },
  { id: 24, dateEntree: "06/11/2025", marque: "Mercedes",     modele: "S 500 4Matic",      plaque: "OP-012-QR", vin: "W1K6G7GB0NA000024", prixAchat: 88000, fournisseur: "BCA Paris",              dateSortie: "18/11/2025", acquereur: "Martin Bernard",  prixCession: 108200, statut: "vendu" },
  { id: 25, dateEntree: "09/11/2025", marque: "BMW",          modele: "i7 xDrive60",       plaque: "ST-345-UV", vin: "WBY43EH07PCB00025", prixAchat: 96000, fournisseur: "Manheim Paris",          dateSortie: "21/11/2025", acquereur: "Ahmed Benali",    prixCession: 116800, statut: "vendu" },
  { id: 26, dateEntree: "12/11/2025", marque: "Lamborghini",  modele: "Huracán EVO",       plaque: "WX-678-YZ", vin: "ZHWUC1ZF8NLA00026", prixAchat: 178000, fournisseur: "Particulier",           dateSortie: "24/11/2025", acquereur: "Marie Dubois",    prixCession: 214000, statut: "vendu" },
  // Octobre 2025
  { id: 27, dateEntree: "03/10/2025", marque: "Porsche",      modele: "Taycan Turbo S",    plaque: "AB-901-CD", vin: "WP0AF2A81NS000027", prixAchat: 112000, fournisseur: "BCA Stuttgart",         dateSortie: "14/10/2025", acquereur: "Sophie Leclerc",  prixCession: 134400, statut: "vendu" },
  { id: 28, dateEntree: "06/10/2025", marque: "Ferrari",      modele: "SF90 Stradale",     plaque: "EF-234-GH", vin: "ZFF88NLA4P0000028", prixAchat: 380000, fournisseur: "Particulier",           dateSortie: "20/10/2025", acquereur: "Pierre Moreau",   prixCession: 448000, statut: "vendu" },
  { id: 29, dateEntree: "10/10/2025", marque: "Rolls-Royce",  modele: "Ghost",             plaque: "IJ-567-KL", vin: "SCA664S54PUX00029", prixAchat: 248000, fournisseur: "Auto Enchères Paris",   dateSortie: "22/10/2025", acquereur: "Karim Mansouri",  prixCession: 292000, statut: "vendu" },
  { id: 30, dateEntree: "14/10/2025", marque: "Aston Martin", modele: "DBX707",            plaque: "MN-890-OP", vin: "SCFSMGAW4PGT00030", prixAchat: 168000, fournisseur: "BCA Paris",             dateSortie: "26/10/2025", acquereur: "Lucas Martin",    prixCession: 198400, statut: "vendu" },
]
