/**
 * Service catalogue — copied 1:1 from the designer prototype (LIVO-website/assets/js/data.js).
 *
 * Static for the design phase. When the backend lands this becomes the seed for the
 * `Service` / `ServiceCategory` tables and the API returns the same shape, so the UI only
 * swaps its data source. Images live in /public/img/{icons,services,cats}/<id>.webp.
 */
import type { Locale, Localized } from "@/i18n/config"

export type CategoryId = "repairs" | "renovation" | "cleaning-garden" | "moving" | "cars" | "newcomers"

export interface ServiceCategory {
  id: CategoryId
  emoji: string
  name: Localized
  /** gradient behind the banner image: [from, to] */
  colors: [string, string]
}

export interface Service {
  id: string
  category: CategoryId
  emoji: string
  name: Localized
  description: Localized
  subServices: Localized<string[]>
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {id:"repairs",emoji:"🔧",name:{en:"Repairs",fr:"Réparations",de:"Reparaturen"},colors:["#04123A","#7B2FF7"]},
  {id:"renovation",emoji:"🏗️",name:{en:"Renovation",fr:"Rénovation",de:"Renovierung"},colors:["#7B2FF7","#C42B9B"]},
  {id:"cleaning-garden",emoji:"🌿",name:{en:"Cleaning & garden",fr:"Nettoyage & jardin",de:"Reinigung & Garten"},colors:["#0A1F5C","#C42B9B"]},
  {id:"moving",emoji:"📦",name:{en:"Moving & delivery",fr:"Déménagement & livraison",de:"Umzug & Lieferung"},colors:["#C42B9B","#FF3D5A"]},
  {id:"cars",emoji:"🚗",name:{en:"Cars",fr:"Auto",de:"Auto"},colors:["#04123A","#4B5680"]},
  {id:"newcomers",emoji:"👋",name:{en:"Newcomers",fr:"Nouveaux arrivants",de:"Neuankömmlinge"},colors:["#FF3D5A","#7B2FF7"]},
]

export const SERVICES: Service[] = [
  {id:"handyman",category:"repairs",emoji:"🔧",name:{en:"Handyman Services",fr:"Bricolage & petites réparations",de:"Handwerkerservice"},description:{en:"General repairs, shelves, fixtures and minor fixes.",fr:"Réparations générales, étagères, fixations et petits travaux.",de:"Allgemeine Reparaturen, Regale, Befestigungen und Kleinarbeiten."},subServices:{en:["Shelves & fixtures","Door handles","Minor fixes"],fr:["Étagères & fixations","Poignées de porte","Petits travaux"],de:["Regale & Befestigungen","Türgriffe","Kleinreparaturen"]}},
  {id:"carpentry",category:"repairs",emoji:"📐",name:{en:"Carpentry",fr:"Menuiserie",de:"Tischlerarbeiten"},description:{en:"Woodwork, doors, cabinets and shelves.",fr:"Boiseries, portes, placards et étagères.",de:"Holzarbeiten, Türen, Schränke und Regale."},subServices:{en:["Doors","Cabinets","Shelves"],fr:["Portes","Placards","Étagères"],de:["Türen","Schränke","Regale"]}},
  {id:"plumbing",category:"repairs",emoji:"🚰",name:{en:"Plumbing",fr:"Plomberie",de:"Sanitär"},description:{en:"Leaks, taps, sanitary fixtures, kitchen and bathroom.",fr:"Fuites, robinets, sanitaires, cuisine et salle de bain.",de:"Lecks, Wasserhähne, Sanitäranlagen, Küche und Bad."},subServices:{en:["Leaks","Taps","Kitchen & bathroom"],fr:["Fuites","Robinets","Cuisine & salle de bain"],de:["Lecks","Wasserhähne","Küche & Bad"]}},
  {id:"electrical",category:"repairs",emoji:"💡",name:{en:"Electrical Services",fr:"Électricité",de:"Elektroarbeiten"},description:{en:"Faults, lighting, switches and sockets.",fr:"Pannes, éclairage, interrupteurs et prises.",de:"Störungen, Beleuchtung, Schalter und Steckdosen."},subServices:{en:["Fault repair","Lighting","Sockets & switches"],fr:["Dépannage","Éclairage","Prises & interrupteurs"],de:["Störungsbehebung","Beleuchtung","Steckdosen & Schalter"]}},
  {id:"furniture",category:"repairs",emoji:"🛏️",name:{en:"Furniture Assembly",fr:"Montage de meubles",de:"Möbelmontage"},description:{en:"Wardrobes, beds, desks and tables.",fr:"Armoires, lits, bureaux et tables.",de:"Kleiderschränke, Betten, Schreibtische und Tische."},subServices:{en:["Wardrobes","Beds","Desks & tables"],fr:["Armoires","Lits","Bureaux & tables"],de:["Kleiderschränke","Betten","Schreibtische & Tische"]}},
  {id:"painting",category:"renovation",emoji:"🎨",name:{en:"Painting & Wall Fixing",fr:"Peinture & murs",de:"Malerarbeiten & Wände"},description:{en:"Interior painting, wall prep and crack repair.",fr:"Peinture intérieure, préparation et réparation des fissures.",de:"Innenanstrich, Wandvorbereitung und Rissreparatur."},subServices:{en:["Interior painting","Wall prep","Crack repair"],fr:["Peinture intérieure","Préparation des murs","Fissures"],de:["Innenanstrich","Wandvorbereitung","Rissreparatur"]}},
  {id:"flooring",category:"renovation",emoji:"🏠",name:{en:"Flooring",fr:"Revêtements de sol",de:"Bodenbeläge"},description:{en:"Parquet and HDF flooring installation.",fr:"Pose de parquet et de sol HDF.",de:"Verlegung von Parkett und HDF-Böden."},subServices:{en:["Parquet","HDF flooring"],fr:["Parquet","Sol HDF"],de:["Parkett","HDF-Böden"]}},
  {id:"ceramic",category:"renovation",emoji:"🏛️",name:{en:"Ceramic & Marble",fr:"Carrelage & marbre",de:"Fliesen & Marmor"},description:{en:"Tiling, marble floors and stairs.",fr:"Carrelage, sols et escaliers en marbre.",de:"Fliesenarbeiten, Marmorböden und Treppen."},subServices:{en:["Tiling","Marble floors","Stairs"],fr:["Carrelage","Sols en marbre","Escaliers"],de:["Fliesen","Marmorböden","Treppen"]}},
  {id:"construction",category:"renovation",emoji:"🏗️",name:{en:"Construction & Renovation",fr:"Construction & rénovation",de:"Bau & Renovierung"},description:{en:"Gypsum board, finishing and related trades.",fr:"Plaques de plâtre, finitions et corps de métier associés.",de:"Gipskarton, Ausbau und verwandte Gewerke."},subServices:{en:["Gypsum board","Finishing","Renovation"],fr:["Plaques de plâtre","Finitions","Rénovation"],de:["Gipskarton","Ausbau","Renovierung"]}},
  {id:"cleaning",category:"cleaning-garden",emoji:"✨",name:{en:"Cleaning Services",fr:"Nettoyage",de:"Reinigung"},description:{en:"Home and office, routine cleaning.",fr:"Maison et bureau, nettoyage régulier.",de:"Haus und Büro, regelmäßige Reinigung."},subServices:{en:["Home","Office","Routine cleaning"],fr:["Maison","Bureau","Nettoyage régulier"],de:["Haus","Büro","Regelmäßige Reinigung"]}},
  {id:"gardening",category:"cleaning-garden",emoji:"🌿",name:{en:"Gardening",fr:"Jardinage",de:"Gartenarbeit"},description:{en:"Lawn care, hedges and garden cleaning.",fr:"Pelouse, haies et nettoyage du jardin.",de:"Rasenpflege, Hecken und Gartenreinigung."},subServices:{en:["Lawn care","Hedge trimming","Garden cleaning"],fr:["Pelouse","Taille de haies","Nettoyage du jardin"],de:["Rasenpflege","Heckenschnitt","Gartenreinigung"]}},
  {id:"moving",category:"moving",emoji:"📦",name:{en:"Moving Services",fr:"Déménagement",de:"Umzugsservice"},description:{en:"Transport, loading and unloading.",fr:"Transport, chargement et déchargement.",de:"Transport, Be- und Entladen."},subServices:{en:["Transport","Loading & unloading","Moving help"],fr:["Transport","Chargement & déchargement","Aide au déménagement"],de:["Transport","Be- & Entladen","Umzugshilfe"]}},
  {id:"delivery",category:"moving",emoji:"🛵",name:{en:"Delivery & Errands",fr:"Livraison & courses",de:"Lieferung & Besorgungen"},description:{en:"Pickup, delivery and everyday errands.",fr:"Retrait, livraison et courses du quotidien.",de:"Abholung, Lieferung und Besorgungen des Alltags."},subServices:{en:["Pickup","Delivery","Errands"],fr:["Retrait","Livraison","Courses"],de:["Abholung","Lieferung","Besorgungen"]}},
  {id:"airport",category:"moving",emoji:"✈️",name:{en:"Airport Transfer",fr:"Transfert aéroport",de:"Flughafentransfer"},description:{en:"Rides to and from the airport.",fr:"Trajets vers et depuis l’aéroport.",de:"Fahrten zum und vom Flughafen."},subServices:{en:["To the airport","From the airport"],fr:["Vers l’aéroport","Depuis l’aéroport"],de:["Zum Flughafen","Vom Flughafen"]}},
  {id:"tools",category:"moving",emoji:"🛠️",name:{en:"Tool Rental",fr:"Location d’outils",de:"Werkzeugverleih"},description:{en:"Tools and equipment for repairs and garden.",fr:"Outils et équipements pour travaux et jardin.",de:"Werkzeuge und Geräte für Reparaturen und Garten."},subServices:{en:["Power tools","Repair tools","Garden tools"],fr:["Outils électriques","Outils de réparation","Outils de jardin"],de:["Elektrowerkzeuge","Reparaturwerkzeuge","Gartengeräte"]}},
  {id:"car",category:"cars",emoji:"🚗",name:{en:"Car Services",fr:"Services auto",de:"Autoservice"},description:{en:"Mechanical, electrical and tyre services.",fr:"Mécanique, électricité et pneus.",de:"Mechanik, Autoelektrik und Reifen."},subServices:{en:["Mechanical","Auto electrical","Tyres"],fr:["Mécanique","Électricité auto","Pneus"],de:["Mechanik","Autoelektrik","Reifen"]}},
  {id:"welcome",category:"newcomers",emoji:"👋",name:{en:"Welcome Service",fr:"Service d’accueil",de:"Willkommensservice"},description:{en:"Settling-in help for newcomers to Luxembourg.",fr:"Aide à l’installation pour les nouveaux arrivants au Luxembourg.",de:"Hilfe beim Ankommen für Neuankömmlinge in Luxemburg."},subServices:{en:["Settling-in","Daily needs","Local guidance"],fr:["Installation","Besoins du quotidien","Conseils locaux"],de:["Ankommen","Alltagsbedarf","Tipps vor Ort"]}},
]

/** Luxembourg towns suggested in the booking chat's address step. */
export const TOWNS: string[] = ["Luxembourg City","Esch-sur-Alzette","Differdange","Dudelange","Ettelbruck","Diekirch","Echternach","Mersch","Remich","Grevenmacher","Wiltz","Bertrange","Strassen","Hesperange","Mamer","Kirchberg"]

/** Typewriter phrases in the home search placeholder. */
export const SEARCH_PHRASES: Record<Locale, string[]> = {
  en: [
    "Fix a leaking tap in the kitchen",
    "Assemble a wardrobe in the bedroom",
    "Trim the hedge in the garden",
    "Clean my apartment before moving out",
    "Pick me up from the airport",
    "Help me settle in Luxembourg"
  ],
  fr: [
    "Réparer un robinet qui fuit dans la cuisine",
    "Monter une armoire dans la chambre",
    "Tailler la haie du jardin",
    "Nettoyer mon appartement avant de déménager",
    "Venir me chercher à l’aéroport",
    "M’aider à m’installer au Luxembourg"
  ],
  de: [
    "Tropfenden Wasserhahn in der Küche reparieren",
    "Kleiderschrank im Schlafzimmer aufbauen",
    "Hecke im Garten schneiden",
    "Wohnung vor dem Auszug reinigen",
    "Abholung vom Flughafen",
    "Hilfe beim Ankommen in Luxemburg"
  ]
}

/** "Popular requests" chips under the home search: [serviceId, label]. */
export const POPULAR_REQUESTS: Record<Locale, [string, string][]> = {en:[["plumbing","My drain is clogged"],["cleaning","I need a cleaner"],["moving","I need to move some stuff"],["gardening","I’m looking for a gardener"],["handyman","Handyman"],["painting","Paint a room"]],fr:[["plumbing","Mon évier est bouché"],["cleaning","Il me faut un nettoyage"],["moving","Je dois déménager des affaires"],["gardening","Je cherche un jardinier"],["handyman","Bricoleur"],["painting","Peindre une pièce"]],de:[["plumbing","Mein Abfluss ist verstopft"],["cleaning","Ich brauche eine Reinigungskraft"],["moving","Ich muss Sachen transportieren"],["gardening","Ich suche einen Gärtner"],["handyman","Handwerker"],["painting","Ein Zimmer streichen"]]}
