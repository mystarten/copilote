# PRODUCT AUDIT — Copilote (PVOI SaaS)
*Mis à jour : 21 mars 2026*

---

## 1. Vue d'ensemble

**Copilote** est un SaaS de gestion pour professionnels de l'automobile (garages, négociants VO/VN) permettant de générer des documents légaux en quelques minutes.

**Proposition de valeur principale :** Remplacer les PVOI papier / cerfa par un flux numérique automatisé, du dossier client à la génération PDF signée.

**Stack technique :**
- Frontend : React 19 + Vite + Tailwind CSS
- Auth & BDD : Supabase (PostgreSQL + Storage)
- Génération PDF : N8N (webhook cloud → `n8n.srv1104296.hstgr.cloud`)
- IA : OpenRouter (Perplexity Sonar Pro Search pour l'estimation de cote)
- Icons : Lucide React
- Charts : Recharts
- Routing : React Router v7

---

## 2. Fonctionnalités existantes

### ✅ Auth & Onboarding
- Login / Signup (layout 70/30 avec brand panel)
- Détection compte démo (`demo@copilote.fr / Demo2024!`)
- Wizard onboarding 5 étapes : infos garage → adresse → logo/types de vente → signature canvas → récapitulatif
- Signature dessinée sur canvas (souris + tactile)
- Tour guidé au premier lancement

### ✅ Dashboard
- KPIs temps réel (ventes du mois, docs générés, dossiers en cours, temps moyen)
- Tableau des ventes récentes avec badges statut/type
- Panneau détail latéral par vente
- Données Supabase (ou mock pour démo)

### ✅ Nouvelle Vente (4 étapes)
- **Étape 1 :** Sélection/création client depuis la base clients
- **Étape 2 :** Recherche véhicule (base VIN démo : BMW, Porsche, Mercedes…) + ajout manuel
- **Étape 3 :** Prix, paiement, type de vente, date, garantie + estimateur de cote IA
- **Étape 4 :** Sélection documents, génération via N8N, prévisualisation, téléchargement/envoi
- Preview live du document en sidebar desktop
- Animation confetti à la génération
- Types supportés : France, Export, Import

### ✅ Gestion Clients
- CRUD complet (ajout, édition, suppression avec confirmation)
- Upload CNI drag-drop (image/PDF, max 5 Mo)
- Prévisualisation CNI (modal image)
- Toasts pour les actions

### ✅ Livre de Police
- Inventaire véhicules avec statut stock/vendu
- Sélecteur pays (10 pays : FR, DE, ES, IT, BE, NL, PT, GB, CH, LU)
- Formatage plaque adapté par pays
- Champs obligatoires : marque, modèle, plaque, prix achat, fournisseur, date entrée
- Champs optionnels (accordéon déroulant) : VIN, année, km, carburant, puissance, cylindrée, carrosserie, couleur, transmission
- Estimation cote via IA (PriceEstimator avec bouton "Utiliser ce prix")
- Export PDF/Excel (bulk)
- Filtres : statut, pays, date

### ✅ Statistiques
- CA, marge, taux de marge, nb véhicules vendus
- Tendances 6 mois (barres + courbes via Recharts)
- Top 5 véhicules par marge
- Répartition par type (France/Export/Import — camembert)
- Données démo hardcodées pour les non-utilisateurs

### ✅ Paramètres
- Profil garage (nom, SIRET, adresse, téléphone, site web, logo)
- Upload/dessin signature
- Changement email avec vérification mot de passe
- Affichage plan avec liste features
- Thème clair/sombre

### ✅ Infrastructure technique
- Contextes React : User, Clients, Vehicles, LivreDePolice, Theme
- Formatters : téléphone, SIRET, code postal
- `pays.js` : config 10 pays avec flags, labels, docs d'import, lien historique
- `vinDecoder.js` : NHTSA vPIC + Gemini Flash fallback (fichier présent, non connecté à l'UI)
- `recalls.js` : API NHTSA Recalls (fichier présent, non connecté à l'UI)
- `openrouter.js` : estimation cote Perplexity Sonar Pro Search
- Workflow N8N `vehicle-lookup.json` : Auto-Ways SIV (prêt, en attente approbation token)

---

## 3. Fonctionnalités manquantes (par priorité)

### 🔴 Priorité haute (bloquant ou fort impact commercial)

| # | Feature | Détail |
|---|---------|--------|
| 1 | **Génération PDF réelle** | Les templates N8N doivent être robustes sur tous types (France / Export / Import). Vérifier les champs PVOI légaux obligatoires. |
| 2 | **Envoi email automatique** | Envoyer le PDF signé directement au client depuis l'app (action N8N `SEND_EMAIL` existe mais UI manque) |
| 3 | **Pré-remplissage véhicule (plaque/VIN)** | Auto-Ways SIV en attente → prévoir fallback NHTSA déjà codé ou intégration manuelle guidée |
| 4 | **Recherche client rapide** | SearchModal existe mais pas encore connectée à un résultat cliquable navigable |
| 5 | **Facturation Stripe** | Plans définis (Solo 79€, Pro 149€, Réseau 349€) mais aucun paiement réel implémenté |

### 🟡 Priorité moyenne (améliore la rétention)

| # | Feature | Détail |
|---|---------|--------|
| 6 | **Notifications in-app** | Composant `Notifications.jsx` présent mais contenu non connecté |
| 7 | **Historique véhicule** | `VehicleHistory.jsx` créé mais retiré de l'UI — possibilité de lien Histovec + docs import |
| 8 | **Rappels sécurité** | `recalls.js` NHTSA prêt — afficher les rappels actifs sur la fiche véhicule |
| 9 | **Gestion multi-utilisateurs** | Plan Réseau prévu mais pas de sub-accounts ni de rôles (admin/vendeur) |
| 10 | **Import CSV véhicules** | Aucun import en masse — saisie manuelle obligatoire |
| 11 | **Archivage dossiers** | Pas de statut "archivé" ou corbeille sur les ventes/clients |

### 🟢 Priorité basse (polish & growth)

| # | Feature | Détail |
|---|---------|--------|
| 12 | **Application mobile native** | Pas de PWA installable, pas de app store |
| 13 | **Signature électronique client** | Actuellement signature garage uniquement — prévoir lien de signature pour le client |
| 14 | **Suivi des paiements** | Pas de tracking versements/acomptes par dossier |
| 15 | **Intégration comptabilité** | Export vers Dolibarr, QuickBooks, ou FEC |
| 16 | **API publique** | Aucune API tierce pour intégration DMS garage |
| 17 | **Plan gratuit / freemium** | Pas de plan free pour l'acquisition — uniquement essai |

---

## 4. Dette technique

| Problème | Fichier | Impact |
|----------|---------|--------|
| Clé Supabase hardcodée | `src/lib/supabase.js` | Sécurité — à passer en env var |
| Mock data mélangé avec prod | `src/lib/mockData.js` | Risque d'afficher des fausses données en prod |
| `recalls.js` et `vinDecoder.js` non utilisés | — | Dead code, à connecter ou supprimer |
| `VehicleInfoBadge.jsx` non utilisé | — | Dead code |
| N8N URL en dur + proxy dev | `src/lib/n8n.js` | À externaliser proprement via env |
| Pas de tests unitaires | — | Régressions difficiles à détecter |
| CSS inline massivement utilisé | Tous les fichiers JSX | Difficile à maintenir vs Tailwind classes |

---

## 5. Comparatif concurrents

| Feature | **Copilote** | MyReport Auto | AutoManager | Salesforce Auto |
|---------|:---:|:---:|:---:|:---:|
| PVOI en 4 min | ✅ | ✅ | ✅ | ✅ |
| Multi-pays (10) | ✅ | ❌ | ❌ | ✅ |
| Estimation cote IA | ✅ | ❌ | ❌ | ❌ |
| Livre de Police intégré | ✅ | ✅ | ✅ | ❌ |
| Base clients + CNI | ✅ | ✅ | ✅ | ✅ |
| Signature électronique | Partielle | ✅ | ✅ | ✅ |
| Signature client à distance | ❌ | ✅ | ❌ | ✅ |
| Envoi email intégré | Partiel | ✅ | ✅ | ✅ |
| Multi-utilisateurs | ❌ | ✅ | ✅ | ✅ |
| Stats/analytics | ✅ | Basique | Basique | ✅ |
| Pré-remplissage plaque SIV | En cours | ✅ | ✅ | ❌ |
| Prix (mensuel) | 79-349€ | 49-199€ | 89€ | 500€+ |

**Avantages distinctifs Copilote :**
- Multi-pays le plus complet du marché
- IA pour estimation de cote (unique)
- UX moderne vs concurrents vieillissants
- Prix compétitif pour PME

**Points de faiblesse face aux concurrents :**
- Pas de signature client à distance
- Pas de multi-utilisateurs (Plan Réseau pas encore opérationnel)
- Pré-remplissage SIV en attente

---

## 6. Quick Wins (< 2 jours chacun)

1. **Connecter `recalls.js` à la fiche véhicule** — 1 composant, données gratuites NHTSA
2. **Envoi email depuis étape 4** — Action N8N `SEND_EMAIL` déjà définie, juste bouton UI
3. **Lien Histovec dans fiche véhicule** — URL pré-construite dans `pays.js`, simple lien `<a>`
4. **Tour guidé complet** — `Tour.jsx` existe, étendre les étapes à NewSale et LivreDePolice
5. **Export CSV Livre de Police** — Ajout trivial depuis les données déjà en state
6. **PWA manifest** — `vite-plugin-pwa` pour installabilité mobile sans app store

---

## 7. Roadmap suggérée

### V1.1 (Stabilisation — 2 semaines)
- [ ] Tests de génération PDF sur tous types de vente
- [ ] Envoi email intégré
- [ ] Stripe Checkout pour les plans
- [ ] Fix clé Supabase en env var

### V1.2 (Acquisition — 1 mois)
- [ ] Intégration SIV Auto-Ways (token approuvé)
- [ ] Signature électronique client (lien de signature)
- [ ] Import CSV véhicules

### V2.0 (Scale — 3 mois)
- [ ] Multi-utilisateurs (admin + vendeurs)
- [ ] Application mobile (PWA)
- [ ] API publique + webhooks
- [ ] Intégration comptabilité (export FEC)

---

*Document généré automatiquement à partir de l'audit du code source. À mettre à jour à chaque sprint.*
