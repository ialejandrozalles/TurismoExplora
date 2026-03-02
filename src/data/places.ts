export type PlaceType = "Natural" | "Cultural" | "Histórico" | "Recreativo" | "Urbano";
export type EntryCost = "Gratuito" | "Pago";
export type Season = "Verano" | "Invierno" | "Todo el año";
export type Climate = "Cálido" | "Frío" | "Templado" | "Seco" | "Lluvioso";
export type Accessibility = "Alta" | "Media" | "Baja";

export interface TouristPlace {
  id: string;
  name: string;
  department: string;
  city: string;
  type: PlaceType;
  entryCost: EntryCost;
  climate: Climate;
  season: Season;
  accessibility: Accessibility;
  description: string;
  image: string;
  popularidad: number;
  visitas: number;
}

import machuPicchu from "@/assets/destinations/machu-picchu.jpg";
import torresDelPaine from "@/assets/destinations/torres-del-paine.jpg";
import guanajuato from "@/assets/destinations/guanajuato.jpg";
import kyoto from "@/assets/destinations/kyoto.jpg";
import marrakech from "@/assets/destinations/marrakech.jpg";
import queenstown from "@/assets/destinations/queenstown.jpg";
import cappadocia from "@/assets/destinations/cappadocia.jpg";
import bali from "@/assets/destinations/bali.jpg";
import petra from "@/assets/destinations/petra.jpg";
import interlaken from "@/assets/destinations/interlaken.jpg";
import buenosAires from "@/assets/destinations/buenos-aires.jpg";
import iguazu from "@/assets/destinations/iguazu.jpg";
import coliseo from "@/assets/destinations/coliseo.jpg";
import parqueCentral from "@/assets/destinations/parque-central.jpg";
import tikal from "@/assets/destinations/tikal.jpg";
import atitlan from "@/assets/destinations/atitlan.jpg";
import antigua from "@/assets/destinations/antigua.jpg";
import semucChampey from "@/assets/destinations/semuc-champey.jpg";
import oaxaca from "@/assets/destinations/oaxaca.jpg";

export const places: TouristPlace[] = [
  {
    id: "1",
    name: "Machu Picchu",
    department: "Cusco",
    city: "Aguas Calientes",
    type: "Histórico",
    entryCost: "Pago",
    climate: "Templado",
    season: "Verano",
    accessibility: "Baja",
    description: "Antigua ciudadela inca declarada Patrimonio de la Humanidad, ubicada en lo alto de los Andes peruanos.",
    image: machuPicchu,
    popularidad: 98,
    visitas: 1500000,
  },
  {
    id: "2",
    name: "Torres del Paine",
    department: "Magallanes",
    city: "Puerto Natales",
    type: "Natural",
    entryCost: "Pago",
    climate: "Frío",
    season: "Verano",
    accessibility: "Baja",
    description: "Parque nacional con montañas imponentes, glaciares y lagos turquesa en la Patagonia chilena.",
    image: torresDelPaine,
    popularidad: 92,
    visitas: 300000,
  },
  {
    id: "3",
    name: "Centro Histórico de Guanajuato",
    department: "Guanajuato",
    city: "Guanajuato",
    type: "Cultural",
    entryCost: "Gratuito",
    climate: "Templado",
    season: "Todo el año",
    accessibility: "Alta",
    description: "Ciudad colonial Patrimonio de la Humanidad con callejones coloridos, teatros y arquitectura barroca.",
    image: guanajuato,
    popularidad: 85,
    visitas: 500000,
  },
  {
    id: "4",
    name: "Templos de Kyoto",
    department: "Kansai",
    city: "Kyoto",
    type: "Cultural",
    entryCost: "Pago",
    climate: "Templado",
    season: "Verano",
    accessibility: "Alta",
    description: "Conjunto de templos milenarios, jardines zen y santuarios sintoístas en la antigua capital imperial japonesa.",
    image: kyoto,
    popularidad: 95,
    visitas: 2000000,
  },
  {
    id: "5",
    name: "Medina de Marrakech",
    department: "Marrakech-Safi",
    city: "Marrakech",
    type: "Cultural",
    entryCost: "Gratuito",
    climate: "Cálido",
    season: "Invierno",
    accessibility: "Media",
    description: "Zocos vibrantes, palacios históricos y plazas animadas en el corazón de la ciudad roja de Marruecos.",
    image: marrakech,
    popularidad: 88,
    visitas: 800000,
  },
  {
    id: "6",
    name: "Lago Wakatipu",
    department: "Otago",
    city: "Queenstown",
    type: "Natural",
    entryCost: "Gratuito",
    climate: "Frío",
    season: "Todo el año",
    accessibility: "Alta",
    description: "Lago glaciar rodeado de montañas nevadas, ideal para paseos, kayak y contemplación del paisaje.",
    image: queenstown,
    popularidad: 82,
    visitas: 150000,
  },
  {
    id: "7",
    name: "Valle de Capadocia",
    department: "Anatolia Central",
    city: "Göreme",
    type: "Natural",
    entryCost: "Pago",
    climate: "Seco",
    season: "Verano",
    accessibility: "Media",
    description: "Formaciones rocosas únicas con ciudades subterráneas y paisajes lunares esculpidos por la erosión.",
    image: cappadocia,
    popularidad: 91,
    visitas: 600000,
  },
  {
    id: "8",
    name: "Terrazas de Arroz de Tegallalang",
    department: "Bali",
    city: "Ubud",
    type: "Natural",
    entryCost: "Pago",
    climate: "Cálido",
    season: "Verano",
    accessibility: "Media",
    description: "Espectaculares terrazas de arroz escalonadas con sistema de irrigación tradicional balinés.",
    image: bali,
    popularidad: 89,
    visitas: 450000,
  },
  {
    id: "9",
    name: "Ciudad de Petra",
    department: "Ma'an",
    city: "Wadi Musa",
    type: "Histórico",
    entryCost: "Pago",
    climate: "Seco",
    season: "Invierno",
    accessibility: "Media",
    description: "Ciudad nabatea tallada en roca rojiza, una de las Siete Maravillas del Mundo Moderno.",
    image: petra,
    popularidad: 96,
    visitas: 1100000,
  },
  {
    id: "10",
    name: "Alpes de Interlaken",
    department: "Oberland Bernés",
    city: "Interlaken",
    type: "Natural",
    entryCost: "Gratuito",
    climate: "Frío",
    season: "Todo el año",
    accessibility: "Alta",
    description: "Paisaje alpino entre lagos cristalinos y cumbres nevadas, con senderos accesibles para todos.",
    image: interlaken,
    popularidad: 86,
    visitas: 400000,
  },
  {
    id: "11",
    name: "Barrio de La Boca",
    department: "Buenos Aires",
    city: "Buenos Aires",
    type: "Urbano",
    entryCost: "Gratuito",
    climate: "Templado",
    season: "Todo el año",
    accessibility: "Alta",
    description: "Icónico barrio porteño con casas de colores, arte callejero, tango y gastronomía local.",
    image: buenosAires,
    popularidad: 87,
    visitas: 1200000,
  },
  {
    id: "12",
    name: "Cataratas del Iguazú",
    department: "Misiones",
    city: "Puerto Iguazú",
    type: "Natural",
    entryCost: "Pago",
    climate: "Cálido",
    season: "Todo el año",
    accessibility: "Alta",
    description: "Impresionante sistema de cascadas rodeadas de selva subtropical, Patrimonio de la Humanidad.",
    image: iguazu,
    popularidad: 94,
    visitas: 1400000,
  },
  {
    id: "13",
    name: "Coliseo Romano",
    department: "Lacio",
    city: "Roma",
    type: "Histórico",
    entryCost: "Pago",
    climate: "Templado",
    season: "Todo el año",
    accessibility: "Alta",
    description: "Anfiteatro romano del siglo I, símbolo del Imperio Romano y Patrimonio de la Humanidad.",
    image: coliseo,
    popularidad: 99,
    visitas: 7000000,
  },
  {
    id: "14",
    name: "Parque Metropolitano",
    department: "Guatemala",
    city: "Ciudad de Guatemala",
    type: "Recreativo",
    entryCost: "Gratuito",
    climate: "Templado",
    season: "Todo el año",
    accessibility: "Alta",
    description: "Amplia área verde urbana con senderos, juegos infantiles y espacios de recreación familiar.",
    image: parqueCentral,
    popularidad: 70,
    visitas: 800000,
  },
  {
    id: "15",
    name: "Parque Nacional Tikal",
    department: "Petén",
    city: "Flores",
    type: "Histórico",
    entryCost: "Pago",
    climate: "Cálido",
    season: "Invierno",
    accessibility: "Baja",
    description: "Majestuosas pirámides mayas emergiendo de la selva tropical, centro ceremonial del mundo maya.",
    image: tikal,
    popularidad: 89,
    visitas: 350000,
  },
  {
    id: "16",
    name: "Lago de Atitlán",
    department: "Sololá",
    city: "Panajachel",
    type: "Natural",
    entryCost: "Gratuito",
    climate: "Templado",
    season: "Todo el año",
    accessibility: "Media",
    description: "Lago volcánico rodeado de tres volcanes y pueblos indígenas con rica tradición cultural.",
    image: atitlan,
    popularidad: 85,
    visitas: 400000,
  },
  {
    id: "17",
    name: "Antigua Guatemala",
    department: "Sacatepéquez",
    city: "Antigua Guatemala",
    type: "Cultural",
    entryCost: "Gratuito",
    climate: "Templado",
    season: "Todo el año",
    accessibility: "Alta",
    description: "Ciudad colonial Patrimonio de la Humanidad con arquitectura barroca, ruinas y tradiciones vivas.",
    image: antigua,
    popularidad: 93,
    visitas: 650000,
  },
  {
    id: "18",
    name: "Semuc Champey",
    department: "Alta Verapaz",
    city: "Lanquín",
    type: "Natural",
    entryCost: "Pago",
    climate: "Cálido",
    season: "Verano",
    accessibility: "Baja",
    description: "Puente natural de piedra caliza con pozas escalonadas de agua turquesa en medio de la selva.",
    image: semucChampey,
    popularidad: 80,
    visitas: 120000,
  },
  {
    id: "19",
    name: "Monte Albán",
    department: "Oaxaca",
    city: "Oaxaca de Juárez",
    type: "Histórico",
    entryCost: "Pago",
    climate: "Cálido",
    season: "Invierno",
    accessibility: "Media",
    description: "Zona arqueológica zapoteca sobre una meseta con plazas ceremoniales y observatorios astronómicos.",
    image: oaxaca,
    popularidad: 81,
    visitas: 300000,
  },
];

export const departments = [...new Set(places.map((p) => p.department))].sort();
export const cities = [...new Set(places.map((p) => p.city))].sort();
export const placeTypes: PlaceType[] = ["Natural", "Cultural", "Histórico", "Recreativo", "Urbano"];
export const entryCosts: EntryCost[] = ["Gratuito", "Pago"];
export const seasons: Season[] = ["Verano", "Invierno", "Todo el año"];
export const climates: Climate[] = ["Cálido", "Frío", "Templado", "Seco", "Lluvioso"];
export const accessibilityLevels: Accessibility[] = ["Alta", "Media", "Baja"];
