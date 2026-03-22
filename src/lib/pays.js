/**
 * Configuration par pays pour les véhicules d'import
 * Chaque pays définit : flag, nom, format plaque, placeholder, docs requis, lien historique
 */
export const PAYS_CONFIG = {
  FR: {
    flag: '🇫🇷', nom: 'France', code: 'FR',
    plaqueLabel: 'Plaque SIV',
    plaquePlaceholder: 'AB-123-CD',
    plaqueMaxLen: 9,
    plaqueRegex: /^[A-Z]{2}-\d{3}-[A-Z]{2}$/,
    devise: '€', locale: 'fr-FR',
    historiqueUrl: (vin) => vin
      ? `https://histovec.interieur.gouv.fr/histovec/proprietaire?vin=${vin}`
      : 'https://histovec.interieur.gouv.fr',
    historiqueLabel: 'Histovec (officiel)',
    docsImport: [],
    couleur: '#003189',
  },
  DE: {
    flag: '🇩🇪', nom: 'Allemagne', code: 'DE',
    plaqueLabel: 'Kennzeichen',
    plaquePlaceholder: 'B-MW 1234',
    plaqueMaxLen: 12,
    plaqueRegex: null,
    devise: '€', locale: 'de-DE',
    historiqueUrl: (vin) => vin
      ? `https://www.dat.de/fahrzeugbewertung/?vin=${vin}`
      : 'https://www.dat.de',
    historiqueLabel: 'DAT (Allemagne)',
    docsImport: ['COC (Certificat de conformité)', 'Zulassungsbescheinigung Teil II', 'Quitus fiscal', 'Formulaire 846A'],
    couleur: '#000000',
  },
  ES: {
    flag: '🇪🇸', nom: 'Espagne', code: 'ES',
    plaqueLabel: 'Matrícula',
    plaquePlaceholder: '1234-BCD',
    plaqueMaxLen: 8,
    plaqueRegex: null,
    devise: '€', locale: 'es-ES',
    historiqueUrl: (vin) => `https://histovec.interieur.gouv.fr/histovec/proprietaire?vin=${vin || ''}`,
    historiqueLabel: 'DGT / Histovec',
    docsImport: ['COC (Certificat de conformité)', 'Permiso de Circulación', 'Quitus fiscal', 'Formulaire 846A'],
    couleur: '#c60b1e',
  },
  IT: {
    flag: '🇮🇹', nom: 'Italie', code: 'IT',
    plaqueLabel: 'Targa',
    plaquePlaceholder: 'AB 123 CD',
    plaqueMaxLen: 10,
    plaqueRegex: null,
    devise: '€', locale: 'it-IT',
    historiqueUrl: (vin) => `https://histovec.interieur.gouv.fr/histovec/proprietaire?vin=${vin || ''}`,
    historiqueLabel: 'ACI / Histovec',
    docsImport: ['COC (Certificat de conformité)', 'Libretto di circolazione', 'Quitus fiscal', 'Formulaire 846A'],
    couleur: '#009246',
  },
  BE: {
    flag: '🇧🇪', nom: 'Belgique', code: 'BE',
    plaqueLabel: 'Immatriculation',
    plaquePlaceholder: '1-ABC-234',
    plaqueMaxLen: 10,
    plaqueRegex: null,
    devise: '€', locale: 'fr-BE',
    historiqueUrl: (vin) => `https://histovec.interieur.gouv.fr/histovec/proprietaire?vin=${vin || ''}`,
    historiqueLabel: 'DIV / Histovec',
    docsImport: ['COC (Certificat de conformité)', 'Certificat d\'immatriculation belge', 'Quitus fiscal'],
    couleur: '#000000',
  },
  NL: {
    flag: '🇳🇱', nom: 'Pays-Bas', code: 'NL',
    plaqueLabel: 'Kenteken',
    plaquePlaceholder: 'AB-12-CD',
    plaqueMaxLen: 9,
    plaqueRegex: null,
    devise: '€', locale: 'nl-NL',
    historiqueUrl: (vin) => vin
      ? `https://ovi.rdw.nl/default.aspx?kenteken=${vin}`
      : 'https://ovi.rdw.nl',
    historiqueLabel: 'RDW (Pays-Bas)',
    docsImport: ['COC (Certificat de conformité)', 'Kentekenbewijs deel II', 'Quitus fiscal', 'Formulaire 846A'],
    couleur: '#ae1c28',
  },
  PT: {
    flag: '🇵🇹', nom: 'Portugal', code: 'PT',
    plaqueLabel: 'Matrícula',
    plaquePlaceholder: 'AA-12-34',
    plaqueMaxLen: 9,
    plaqueRegex: null,
    devise: '€', locale: 'pt-PT',
    historiqueUrl: (vin) => `https://histovec.interieur.gouv.fr/histovec/proprietaire?vin=${vin || ''}`,
    historiqueLabel: 'IMT / Histovec',
    docsImport: ['COC (Certificat de conformité)', 'Documento Único Automóvel', 'Quitus fiscal', 'Formulaire 846A'],
    couleur: '#006600',
  },
  GB: {
    flag: '🇬🇧', nom: 'Royaume-Uni', code: 'GB',
    plaqueLabel: 'Registration',
    plaquePlaceholder: 'AB12 CDE',
    plaqueMaxLen: 8,
    plaqueRegex: null,
    devise: '£', locale: 'en-GB',
    historiqueUrl: (vin) => vin
      ? `https://www.check-mot.service.gov.uk/results?registration=${vin}`
      : 'https://www.check-mot.service.gov.uk',
    historiqueLabel: 'DVLA MOT Check',
    docsImport: ['COC (Certificat de conformité)', 'V5C (Logbook)', 'Quitus fiscal', 'Formulaire 846A', 'Droits de douane post-Brexit'],
    couleur: '#012169',
  },
  CH: {
    flag: '🇨🇭', nom: 'Suisse', code: 'CH',
    plaqueLabel: 'Kontrollschild',
    plaquePlaceholder: 'ZH 123456',
    plaqueMaxLen: 10,
    plaqueRegex: null,
    devise: 'CHF', locale: 'de-CH',
    historiqueUrl: (vin) => `https://histovec.interieur.gouv.fr/histovec/proprietaire?vin=${vin || ''}`,
    historiqueLabel: 'Histovec (VIN)',
    docsImport: ['COC (Certificat de conformité)', 'Fahrzeugausweis', 'Quitus fiscal', 'Formulaire 846A', 'Droits de douane CH→UE'],
    couleur: '#ff0000',
  },
  LU: {
    flag: '🇱🇺', nom: 'Luxembourg', code: 'LU',
    plaqueLabel: 'Immatriculation',
    plaquePlaceholder: 'AB 1234',
    plaqueMaxLen: 8,
    plaqueRegex: null,
    devise: '€', locale: 'fr-LU',
    historiqueUrl: (vin) => `https://histovec.interieur.gouv.fr/histovec/proprietaire?vin=${vin || ''}`,
    historiqueLabel: 'SNCA / Histovec',
    docsImport: ['COC (Certificat de conformité)', 'Certificat d\'immatriculation LU', 'Quitus fiscal'],
    couleur: '#00a2e8',
  },
}

/**
 * Formate une plaque selon le pays sélectionné
 */
export function formatPlaqueByPays(val, pays) {
  const upper = val.toUpperCase().replace(/[^A-Z0-9\s\-]/g, '')
  if (pays === 'FR') {
    // Format FR : AB-123-CD
    const clean = upper.replace(/[\s\-]/g, '')
    if (clean.length <= 2) return clean
    if (clean.length <= 5) return clean.slice(0, 2) + '-' + clean.slice(2)
    return clean.slice(0, 2) + '-' + clean.slice(2, 5) + '-' + clean.slice(5, 7)
  }
  return upper
}
