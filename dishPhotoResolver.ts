import photoMap from '../../photo-map.json';
import { MenuItem } from '../types';

export interface ResolvedDishPhoto {
  imageUrl?: string;
  photo_source_url?: string;
  photo_status: string;
  hasOriginalPhoto: boolean;
  isConflict: boolean;
  source_item_id?: string;
}

const TRAD_TO_SIMP_MAP: Record<string, string> = {
  '蝦': '虾', '寶': '宝', '蘭': '兰', '魚': '鱼', '雞': '鸡',
  '湯': '汤', '飯': '饭', '麵': '面', '頭': '头', '燒': '烧',
  '滷': '卤', '醬': '酱', '蔥': '葱', '鐵': '铁', '豬': '猪',
  '龍': '龙', '筍': '笋', '帶': '带', '子': '子', '絲': '丝',
  '盤': '盘', '煲': '煲', '豉': '豉', '姜': '姜', '薑': '姜'
};

export function normalizeChineseChars(zh?: string): string {
  let res = (zh || '').trim().replace(/\s+/g, '');
  for (const [trad, simp] of Object.entries(TRAD_TO_SIMP_MAP)) {
    res = res.replaceAll(trad, simp);
  }
  return res;
}

export function normalizeEnglishName(nameEn?: string): string {
  return (nameEn || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function normalizeCategoryKey(category?: string): string {
  return (category || '').toUpperCase().replace(/[^A-Z]/g, '');
}

interface PhotoMapRecord {
  source_item_id: string;
  category: string;
  name: string;
  english_name: string;
  chinese_name: string;
  status: string;
  photo?: {
    asset?: string;
    source_url?: string;
    sha256?: string;
    bytes?: number;
    width?: number;
    height?: number;
  };
}

const records: PhotoMapRecord[] = (photoMap.items as PhotoMapRecord[]) || [];

const bySourceId = new Map<string, PhotoMapRecord>();
const byEnAndCat = new Map<string, PhotoMapRecord>();
const byBilingualIdentity = new Map<string, PhotoMapRecord>();
const byEnOnly = new Map<string, PhotoMapRecord>();

for (const item of records) {
  if (item.source_item_id) {
    bySourceId.set(item.source_item_id.toLowerCase(), item);
  }

  const enKey = normalizeEnglishName(item.english_name);
  const catKey = normalizeCategoryKey(item.category);
  byEnAndCat.set(`${enKey}::${catKey}`, item);

  const zhNorm = normalizeChineseChars(item.chinese_name);
  byBilingualIdentity.set(`${enKey} | ${zhNorm}`, item);

  // Fallback map by English name if unique
  if (!byEnOnly.has(enKey)) {
    byEnOnly.set(enKey, item);
  }
}

/**
 * Resolves authentic photo data for any menu item query according to official Oddle photo-map.json.
 * 
 * Rules:
 * - Match using the actual source_item_id when present.
 * - Otherwise use normalized exact English dish name plus category.
 * - Chinese simplified/traditional spelling differences must not reject an otherwise unambiguous match.
 * - For records marked "available", restores photos using exact photo.asset and photo.source_url.
 * - A missing local file or failed lookup does not mean the official photo is unavailable; preserves working photo URLs.
 * - Preserves existing treatment for genuinely missing photos and flagged image conflicts without substituting other dishes.
 */
export function resolveDishPhoto(
  query: Partial<MenuItem> | {
    source_item_id?: string;
    sourceItemId?: string;
    id?: string;
    nameEn?: string;
    english_name?: string;
    nameZh?: string;
    chinese_name?: string;
    category?: string;
    imageUrl?: string;
    photo_source_url?: string;
    source_url?: string;
    photo_status?: string;
    isConflict?: boolean;
  }
): ResolvedDishPhoto {
  let matched: PhotoMapRecord | null = null;

  const rawSourceId = query.source_item_id || query.sourceItemId;
  if (rawSourceId && bySourceId.has(rawSourceId.toLowerCase())) {
    matched = bySourceId.get(rawSourceId.toLowerCase())!;
  }

  const enName = query.nameEn || query.english_name;
  const category = query.category;

  if (!matched && enName && category) {
    const enCatKey = `${normalizeEnglishName(enName)}::${normalizeCategoryKey(category)}`;
    if (byEnAndCat.has(enCatKey)) {
      matched = byEnAndCat.get(enCatKey)!;
    }
  }

  const zhName = query.nameZh || query.chinese_name;
  if (!matched && enName && zhName) {
    const biKey = `${normalizeEnglishName(enName)} | ${normalizeChineseChars(zhName)}`;
    if (byBilingualIdentity.has(biKey)) {
      matched = byBilingualIdentity.get(biKey)!;
    } else {
      // Traditional/simplified search
      const nEn = normalizeEnglishName(enName);
      const nZh = normalizeChineseChars(zhName);
      for (const item of records) {
        if (normalizeEnglishName(item.english_name) === nEn && normalizeChineseChars(item.chinese_name) === nZh) {
          matched = item;
          break;
        }
      }
    }
  }

  if (!matched && query.id && bySourceId.has(query.id.toLowerCase())) {
    matched = bySourceId.get(query.id.toLowerCase())!;
  }

  if (matched) {
    const isConflict = matched.status === 'official_image_conflict_requires_client_review';
    const isNotProvided = matched.status === 'not_provided_on_official_menu';
    const isAvailable = matched.status === 'available' && !isConflict;

    const sourceUrl = matched.photo?.source_url || query.photo_source_url || query.source_url;
    const localAsset = matched.photo?.asset;

    return {
      imageUrl: isAvailable ? (localAsset || sourceUrl) : undefined,
      photo_source_url: isAvailable ? sourceUrl : undefined,
      photo_status: matched.status,
      hasOriginalPhoto: isAvailable && Boolean(localAsset || sourceUrl),
      isConflict,
      source_item_id: matched.source_item_id
    };
  }

  // Fallback: Preserve existing working photo URLs if already provided
  const fallbackSourceUrl = query.photo_source_url || query.source_url;
  const fallbackImg = query.imageUrl || fallbackSourceUrl;
  const hasPhoto = Boolean(fallbackImg && query.photo_status !== 'not_provided_on_official_menu' && !query.isConflict);

  return {
    imageUrl: hasPhoto ? fallbackImg : undefined,
    photo_source_url: fallbackSourceUrl,
    photo_status: query.photo_status || (hasPhoto ? 'available' : 'not_provided_on_official_menu'),
    hasOriginalPhoto: hasPhoto,
    isConflict: Boolean(query.isConflict),
    source_item_id: rawSourceId
  };
}
