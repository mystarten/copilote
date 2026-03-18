export const initialClients = [
  { id: 1, nom: "Martin Bernard", email: "martin.bernard@gmail.com", telephone: "06 12 34 56 78", adresse: "12 rue de la Paix, 75001 Paris", cni: true },
  { id: 2, nom: "Sophie Leclerc", email: "sophie.leclerc@hotmail.fr", telephone: "07 23 45 67 89", adresse: "8 avenue Foch, 69006 Lyon", cni: true },
  { id: 3, nom: "Ahmed Benali", email: "ahmed.benali@gmail.com", telephone: "06 34 56 78 90", adresse: "45 bd Gambetta, 13001 Marseille", cni: false },
  { id: 4, nom: "Marie Dubois", email: "marie.dubois@orange.fr", telephone: "07 45 67 89 01", adresse: "3 rue Nationale, 59000 Lille", cni: true },
  { id: 5, nom: "Pierre Moreau", email: "pierre.moreau@sfr.fr", telephone: "06 56 78 90 12", adresse: "27 rue Victor Hugo, 33000 Bordeaux", cni: true },
]

export const mockVehicles = [
  { id: 1, plaque: "AB-123-CD", marque: "BMW", modele: "Série 3", annee: 2019, km: 45000, carburant: "Diesel", statut: "En stock" },
  { id: 2, plaque: "EF-456-GH", marque: "Peugeot", modele: "308", annee: 2020, km: 32000, carburant: "Essence", statut: "En stock" },
  { id: 3, plaque: "IJ-789-KL", marque: "Renault", modele: "Clio V", annee: 2021, km: 18000, carburant: "Hybride", statut: "En stock" },
  { id: 4, plaque: "MN-012-OP", marque: "Volkswagen", modele: "Golf 8", annee: 2022, km: 12000, carburant: "Essence", statut: "Vendu" },
  { id: 5, plaque: "QR-345-ST", marque: "Mercedes", modele: "Classe A", annee: 2020, km: 38000, carburant: "Diesel", statut: "En stock" },
]

export const mockSales = [
  { id: 1, client: "Martin Bernard", vehicule: "BMW Série 3", type: "france", statut: "genere", date: "15/03/2026" },
  { id: 2, client: "Sophie Leclerc", vehicule: "Peugeot 308", type: "export", statut: "envoye", date: "14/03/2026" },
  { id: 3, client: "Ahmed Benali", vehicule: "Renault Clio V", type: "import", statut: "en_cours", date: "13/03/2026" },
  { id: 4, client: "Marie Dubois", vehicule: "VW Golf 8", type: "france", statut: "genere", date: "12/03/2026" },
  { id: 5, client: "Pierre Moreau", vehicule: "Mercedes Classe A", type: "export", statut: "envoye", date: "11/03/2026" },
  { id: 6, client: "Lucas Petit", vehicule: "Toyota Yaris", type: "france", statut: "en_cours", date: "10/03/2026" },
]

export const mockLivreDePolice = [
  { id: 1, dateEntree: "01/03/2026", marque: "BMW", modele: "Série 3", plaque: "AB-123-CD", vin: "WBA3A5C50CF256521", prixAchat: 16500, fournisseur: "Auto Enchères Lyon", dateSortie: "15/03/2026", acquereur: "Martin Bernard", prixCession: 19900, statut: "vendu" },
  { id: 2, dateEntree: "05/03/2026", marque: "Peugeot", modele: "308", plaque: "EF-456-GH", vin: "VF3LBBHZHFS123456", prixAchat: 11200, fournisseur: "Particulier", dateSortie: "14/03/2026", acquereur: "Sophie Leclerc", prixCession: 14500, statut: "vendu" },
  { id: 3, dateEntree: "08/03/2026", marque: "Renault", modele: "Clio V", plaque: "IJ-789-KL", vin: "VF1RJA00X65432198", prixAchat: 9800, fournisseur: "BCA Auction", dateSortie: null, acquereur: null, prixCession: null, statut: "stock" },
  { id: 4, dateEntree: "10/03/2026", marque: "Mercedes", modele: "Classe A", plaque: "QR-345-ST", vin: "WDD1770031J654321", prixAchat: 18500, fournisseur: "Auto Enchères Paris", dateSortie: null, acquereur: null, prixCession: null, statut: "stock" },
  { id: 5, dateEntree: "12/03/2026", marque: "Volkswagen", modele: "Golf 8", plaque: "MN-012-OP", vin: "WVWZZZ1KZAM123456", prixAchat: 14200, fournisseur: "Particulier", dateSortie: "16/03/2026", acquereur: "Marie Dubois", prixCession: 17800, statut: "vendu" },
  { id: 6, dateEntree: "13/03/2026", marque: "Toyota", modele: "Yaris", plaque: "UV-678-WX", vin: "JTDBT923X01234567", prixAchat: 7500, fournisseur: "BCA Auction", dateSortie: null, acquereur: null, prixCession: null, statut: "stock" },
  { id: 7, dateEntree: "14/03/2026", marque: "Audi", modele: "A3", plaque: "YZ-901-AB", vin: "WAUZZZ8P5BA012345", prixAchat: 15800, fournisseur: "Auto Enchères Lyon", dateSortie: null, acquereur: null, prixCession: null, statut: "stock" },
  { id: 8, dateEntree: "15/03/2026", marque: "Ford", modele: "Focus", plaque: "CD-234-EF", vin: "WF0FXXGCD5FF12345", prixAchat: 8900, fournisseur: "Particulier", dateSortie: "17/03/2026", acquereur: "Lucas Petit", prixCession: 11500, statut: "vendu" },
  { id: 9, dateEntree: "16/03/2026", marque: "Honda", modele: "Civic", plaque: "GH-567-IJ", vin: "SHHFK2750JU012345", prixAchat: 12300, fournisseur: "BCA Auction", dateSortie: null, acquereur: null, prixCession: null, statut: "stock" },
  { id: 10, dateEntree: "17/03/2026", marque: "Citroën", modele: "C3", plaque: "KL-890-MN", vin: "VF7SC5FV5DW012345", prixAchat: 6800, fournisseur: "Particulier", dateSortie: null, acquereur: null, prixCession: null, statut: "stock" },
]
