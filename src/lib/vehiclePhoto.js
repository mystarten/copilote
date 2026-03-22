/**
 * Photos par catégorie de carrosserie
 * Chaque catégorie a plusieurs photos → hash(marque+modele) choisit laquelle
 * → même modèle = toujours la même photo, modèles différents = photos différentes
 */
import { getCategory } from './vehicleData'

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

const u = (id) => `https://images.unsplash.com/${id}?w=800&q=75`

// ── Pools de photos par catégorie ────────────────────────────────────────────
const POOLS = {

  citadine: [
    u('photo-1541899481282-d53bffe3c35d'),  // VW Golf compact
    u('photo-1512499617640-c74ae3a79d37'),  // petite voiture rouge
    u('photo-1609521263047-f8f205293f24'),  // compacte bleue
    u('photo-1489824904134-891ab64532f1'),  // petite citadine
    u('photo-1471444928139-48c5bf5173f8'),  // compacte de ville
  ],

  berline: [
    u('photo-1494976388531-d1058494cdd8'),  // berline argentée
    u('photo-1549317661-bd32c8ce0db2'),     // berline blanche
    u('photo-1553440569-bcc63803a83d'),     // berline sombre
    u('photo-1503376780353-7e6692767b70'),  // berline route
    u('photo-1564019472231-6ef84be5ca5b'),  // voiture propre blanc
  ],

  berline_luxe: [
    u('photo-1555215695-3004980ad54e'),     // BMW M5 silver
    u('photo-1618843479313-40f8afb4b4d8'), // berline luxe foncée
    u('photo-1606152421802-db97b9c7a11b'), // berline rouge premium
    u('photo-1600712242805-5f78671b24da'), // berline noire luxe
    u('photo-1549317661-bd32c8ce0db2'),    // berline blanche luxe
  ],

  suv_compact: [
    u('photo-1532974297617-c0f05fe48872'),  // petit SUV terrain
    u('photo-1605559424843-9e4c228bf1c2'),  // SUV compact
    u('photo-1519641471654-76ce0107ad1b'),  // SUV noir
    u('photo-1580273916550-e323be2ae537'),  // SUV gris
    u('photo-1609521263047-f8f205293f24'),  // crossover bleu
  ],

  suv: [
    u('photo-1519641471654-76ce0107ad1b'),  // SUV noir route
    u('photo-1580273916550-e323be2ae537'),  // SUV gris
    u('photo-1532974297617-c0f05fe48872'),  // SUV offroad
    u('photo-1543465077-db45d34b88a5'),     // SUV blanc
    u('photo-1625231337098-9d3b65a31ae7'),  // SUV blanc route
  ],

  suv_luxe: [
    u('photo-1519641471654-76ce0107ad1b'),  // SUV noir luxe
    u('photo-1600712242805-5f78671b24da'),  // SUV luxe sombre
    u('photo-1543465077-db45d34b88a5'),     // SUV luxe blanc
    u('photo-1532974297617-c0f05fe48872'),  // 4x4 luxe
    u('photo-1625231337098-9d3b65a31ae7'),  // SUV premium
  ],

  sports: [
    u('photo-1568605117036-5fe5e7bab0b7'),  // coupé sport rouge
    u('photo-1533473359331-0135ef1b58bf'),  // sport nuit
    u('photo-1552519507-da3b142c6e3d'),     // sport bleu
    u('photo-1583267746897-2cf415887172'),  // sport rouge rue
    u('photo-1494905998402-395d579af36f'),  // coupé sport
  ],

  supercar: [
    u('photo-1580274455191-1c62238fa333'),  // Porsche 911 blanc
    u('photo-1592198084033-aade902d1aae'),  // Ferrari rouge
    u('photo-1544636331-e26879cd4d9b'),     // Lamborghini jaune
    u('photo-1552519507-da3b142c6e3d'),     // supercar bleu
    u('photo-1568605117036-5fe5e7bab0b7'),  // supercar rouge
  ],

  electrique: [
    u('photo-1560958089-b8a1929cea89'),     // Tesla blanc
    u('photo-1593941707882-a5bba14938c7'),  // Tesla charging
    u('photo-1571987502227-9231b837d92a'),  // EV moderne
    u('photo-1617788138017-80ad40651399'),  // voiture électrique
    u('photo-1549317661-bd32c8ce0db2'),     // voiture blanche propre
  ],

  cabriolet: [
    u('photo-1544636331-e26879cd4d9b'),     // cabriolet sport
    u('photo-1583267746897-2cf415887172'),  // décapotable rue
    u('photo-1568605117036-5fe5e7bab0b7'),  // roadster rouge
    u('photo-1533473359331-0135ef1b58bf'),  // cabriolet nuit
  ],

  monospace: [
    u('photo-1519641471654-76ce0107ad1b'),  // van familial
    u('photo-1549317661-bd32c8ce0db2'),     // véhicule blanc
    u('photo-1553440569-bcc63803a83d'),     // utilitaire
  ],

  utilitaire: [
    u('photo-1530046339160-ce3e530de7c0'),  // van utilitaire
    u('photo-1519641471654-76ce0107ad1b'),  // pick-up / van
    u('photo-1553440569-bcc63803a83d'),     // utilitaire sombre
  ],

  // Fallback générique
  _default: [
    u('photo-1494976388531-d1058494cdd8'),
    u('photo-1555215695-3004980ad54e'),
    u('photo-1580274455191-1c62238fa333'),
    u('photo-1541899481282-d53bffe3c35d'),
    u('photo-1568605117036-5fe5e7bab0b7'),
    u('photo-1519641471654-76ce0107ad1b'),
    u('photo-1552519507-da3b142c6e3d'),
    u('photo-1583267746897-2cf415887172'),
    u('photo-1560958089-b8a1929cea89'),
    u('photo-1592198084033-aade902d1aae'),
  ],
}

/**
 * Retourne une URL photo déterministe basée sur marque + modèle.
 * La catégorie du modèle détermine le POOL de photos (SUV, berline, supercar…)
 * Le hash(marque+modele) choisit quelle photo dans ce pool.
 */
export function getDefaultVehiclePhoto(marque, modele = '') {
  const seed = `${marque || ''}${modele || ''}`.toUpperCase()
  const cat  = getCategory(marque, modele) || '_default'
  const pool = POOLS[cat] || POOLS._default
  return pool[hash(seed) % pool.length]
}
