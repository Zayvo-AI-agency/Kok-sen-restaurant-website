export interface MenuItemVariant {
  name: string;
  priceSgd: number;
}

export interface MenuItemOptionChoice {
  name: string;
  priceSgd: number;
}

export interface MenuItemOption {
  name: string;
  minimumQuantity?: number;
  maximumQuantity?: number;
  choices: MenuItemOptionChoice[];
}

export interface MenuItem {
  id: string;
  source_item_id?: string;
  sourceItemId?: string;
  source_url?: string;
  photo_source_url?: string;
  name?: string;
  english_name?: string;
  chinese_name?: string;
  itemCode?: string;
  code?: string;
  nameEn: string;
  nameZh: string;
  fullName?: string;
  category: string;
  price: number;
  priceNote?: string;
  sizes?: {
    small?: number;
    medium?: number;
    large?: number;
    half?: number;
    whole?: number;
  };
  variants?: MenuItemVariant[];
  options?: MenuItemOption[];
  description: string;
  imageUrl?: string;
  photos?: string[];
  photo_status?: string;
  isConflict?: boolean;
  tag?: string;
  tagIcon?: string;
  isSignature?: boolean;
  signatureNumber?: string;
  isChefRecommendation?: boolean;
  isVegetarianAvailable?: boolean;
  spicyLevel?: number; // 0-3
  allergens?: string[];
  portionSize?: string;
  orderingNotes?: string[];
}

export interface TableSpreadPreset {
  id: string;
  title: string;
  dinerCount: string;
  estimatedTotal: string;
  subtitle: string;
  isMostPopular?: boolean;
  dishes: string[];
  note: string;
  suggestedItems: string[]; // item IDs
}

export interface TableOrderItem {
  item: MenuItem;
  quantity: number;
  size?: string;
  unitPrice?: number;
  specialNote?: string;
}

export interface OutletHoursConfig {
  daysSummary: string;
  isClosedOnMonday: boolean;
  lunchDisplay: string;
  dinnerDisplay: string;
  lunchTime: string;
  dinnerTime: string;
  lastOrderNote?: string;
  statusNote?: string;
}

export interface OutletInfo {
  id: 'keong-saik' | 'city-square-mall';
  name: string;
  nameZh: string;
  shortName: string;
  address: string;
  district: string;
  phone: string;
  phoneClean: string;
  whatsappNumber: string;
  whatsappUrl: string;
  isFlagship?: boolean;
  hours: OutletHoursConfig;
}

export interface TableReservationRequest {
  outlet: 'keong-saik' | 'city-square-mall';
  name: string;
  phone: string;
  guests: string;
  dateTime: string;
  dietaryNotes: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  rating: number;
  text: string;
  date: string;
  source: 'Google' | 'Michelin Guide' | 'Local Regular';
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  sources?: Array<{ title: string; url: string }>;
  suggestedDishes?: MenuItem[];
  timestamp: string;
}

export interface GalleryPhotoItem {
  id: string;
  title: string;
  category: 'space' | 'dishes' | 'wok' | 'claypot' | 'diner';
  url: string;
  caption: string;
  tag: string;
  aspect?: 'standard' | 'wide' | 'tall';
  isClientPhoto?: boolean;
  uploadedBy?: string;
  date?: string;
  dishCode?: string;
  rating?: number;
}

export interface DishAnalysisResult {
  dishNameEn: string;
  dishNameZh: string;
  matchedItemCode?: string;
  isKokSenSignature: boolean;
  confidenceScore: number;
  wokHeiRating: number;
  wokHeiDescription: string;
  flavorProfile: {
    savory: number;
    sweet: number;
    spicy: number;
    umami: number;
    wokChar: number;
  };
  keyIngredients: string[];
  culinaryTechnique: string;
  heritageStory: string;
  allergens: string[];
  suggestedPairings: string[];
  outletAvailability: string;
  portionSize: string;
  priceRange: string;
}

