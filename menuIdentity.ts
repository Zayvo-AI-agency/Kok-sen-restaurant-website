import { MenuItem } from '../types';
import { FULL_MENU_ITEMS, MENU_CATEGORIES } from '../data/menuData';
import { resolveDishPhoto } from './dishPhotoResolver';

export interface CanonicalDishInfo {
  identityKey: string;
  source_item_id?: string;
  nameEn: string;
  nameZh: string;
  categories: string[];
  itemCodes: string[];
  description: string;
  imageUrl?: string;
  photo_source_url?: string;
  source_url?: string;
  photo_status?: string;
  hasOriginalPhoto: boolean;
  isSignature: boolean;
  isConflict?: boolean;
  orderingNotes?: string[];
  canonicalMenuItem: MenuItem;
}

const TRAD_TO_SIMP_MAP: Record<string, string> = {
  '蝦': '虾', '寶': '宝', '蘭': '兰', '魚': '鱼', '雞': '鸡',
  '湯': '汤', '飯': '饭', '麵': '面', '頭': '头', '燒': '烧',
  '滷': '卤', '醬': '酱', '蔥': '葱', '鐵': '铁', '豬': '猪',
  '龍': '龙', '筍': '笋', '帶': '带', '子': '子', '絲': '丝',
  '盤': '盘', '煲': '煲', '豉': '豉', '薑': '姜'
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

/**
 * Normalizes bilingual dish identity using exact nameEn and normalized nameZh.
 */
export function normalizeDishIdentity(nameEn?: string, nameZh?: string): string {
  const en = normalizeEnglishName(nameEn);
  const zh = normalizeChineseChars(nameZh);
  return `${en} | ${zh}`;
}

// Build a memoized list of canonical dishes from the authoritative 125-item menu
let canonicalCatalogCache: CanonicalDishInfo[] | null = null;
let canonicalMapByIdentityCache: Map<string, CanonicalDishInfo> | null = null;
let canonicalMapByCodeCache: Map<string, CanonicalDishInfo> | null = null;
let canonicalMapByIdCache: Map<string, CanonicalDishInfo> | null = null;
let canonicalMapBySourceItemIdCache: Map<string, CanonicalDishInfo> | null = null;
let canonicalMapByEnAndCatCache: Map<string, CanonicalDishInfo> | null = null;

function initializeCatalog() {
  if (canonicalCatalogCache) return;

  const list: CanonicalDishInfo[] = [];
  const byIdentity = new Map<string, CanonicalDishInfo>();
  const byCode = new Map<string, CanonicalDishInfo>();
  const byId = new Map<string, CanonicalDishInfo>();
  const bySourceId = new Map<string, CanonicalDishInfo>();
  const byEnAndCat = new Map<string, CanonicalDishInfo>();

  for (const item of FULL_MENU_ITEMS) {
    const key = normalizeDishIdentity(item.nameEn, item.nameZh);
    let existing = byIdentity.get(key);

    const photoRes = resolveDishPhoto(item);
    const hasPhoto = photoRes.hasOriginalPhoto;
    const resolvedImg = photoRes.imageUrl || item.imageUrl || item.photo_source_url;
    const resolvedSourceUrl = photoRes.photo_source_url || item.photo_source_url || item.source_url;

    if (!existing) {
      existing = {
        identityKey: key,
        source_item_id: item.source_item_id || photoRes.source_item_id,
        nameEn: item.nameEn,
        nameZh: item.nameZh,
        categories: [item.category],
        itemCodes: item.itemCode ? [item.itemCode] : [],
        description: item.description,
        imageUrl: resolvedImg,
        photo_source_url: resolvedSourceUrl,
        source_url: resolvedSourceUrl,
        photo_status: photoRes.photo_status || item.photo_status,
        hasOriginalPhoto: hasPhoto,
        isSignature: Boolean(item.isSignature || item.category === 'SIGNATURE'),
        isConflict: photoRes.isConflict || Boolean(item.isConflict || item.photo_status === 'official_image_conflict_requires_client_review'),
        orderingNotes: item.orderingNotes,
        canonicalMenuItem: {
          ...item,
          imageUrl: resolvedImg,
          photo_source_url: resolvedSourceUrl,
          source_url: resolvedSourceUrl,
          photo_status: photoRes.photo_status || item.photo_status,
          isConflict: photoRes.isConflict || Boolean(item.isConflict)
        },
      };
      byIdentity.set(key, existing);
      list.push(existing);
    } else {
      if (!existing.categories.includes(item.category)) {
        existing.categories.push(item.category);
      }
      if (item.itemCode && !existing.itemCodes.includes(item.itemCode)) {
        existing.itemCodes.push(item.itemCode);
      }
      if (item.source_item_id && !existing.source_item_id) {
        existing.source_item_id = item.source_item_id;
      }
      if (item.orderingNotes && (!existing.orderingNotes || existing.orderingNotes.length === 0)) {
        existing.orderingNotes = item.orderingNotes;
      }
      if (item.isSignature || item.category === 'SIGNATURE') {
        existing.isSignature = true;
        // Prefer signature entry as canonical if it has photo or better metadata
        if (hasPhoto || !existing.hasOriginalPhoto) {
          existing.canonicalMenuItem = {
            ...item,
            imageUrl: resolvedImg || existing.imageUrl,
            photo_source_url: resolvedSourceUrl || existing.photo_source_url,
            source_url: resolvedSourceUrl || existing.source_url,
            photo_status: photoRes.photo_status || existing.photo_status,
            isConflict: photoRes.isConflict || existing.isConflict
          };
          existing.imageUrl = resolvedImg || existing.imageUrl;
          existing.photo_source_url = resolvedSourceUrl || existing.photo_source_url;
          existing.source_url = resolvedSourceUrl || existing.source_url;
          existing.photo_status = photoRes.photo_status || existing.photo_status;
          existing.hasOriginalPhoto = hasPhoto || existing.hasOriginalPhoto;
        }
      }
    }

    if (item.id) byId.set(item.id.toLowerCase(), existing);
    if (item.source_item_id) {
      byId.set(item.source_item_id.toLowerCase(), existing);
      bySourceId.set(item.source_item_id.toLowerCase(), existing);
    }
    if (item.itemCode) byCode.set(item.itemCode.toUpperCase(), existing);

    const enKey = `${normalizeEnglishName(item.nameEn)}::${normalizeCategoryKey(item.category)}`;
    byEnAndCat.set(enKey, existing);
  }

  canonicalCatalogCache = list;
  canonicalMapByIdentityCache = byIdentity;
  canonicalMapByCodeCache = byCode;
  canonicalMapByIdCache = byId;
  canonicalMapBySourceItemIdCache = bySourceId;
  canonicalMapByEnAndCatCache = byEnAndCat;
}

export function getCanonicalDishes(): CanonicalDishInfo[] {
  initializeCatalog();
  return canonicalCatalogCache!;
}

/**
 * Common authentic dish aliases mapped directly to Kok Sen canonical names.
 * Strictly maps to Kok Sen items, avoiding generic single-ingredient mismatches.
 */
const CANONICAL_ALIASES: Record<string, string> = {
  'big prawn hor fun': 'big prawns hor fun | 大虾滑蛋河粉',
  'big prawns hor fun': 'big prawns hor fun | 大虾滑蛋河粉',
  'prawn hor fun': 'big prawns hor fun | 大虾滑蛋河粉',
  'claypot yong tau foo': 'claypot yong tau foo | 巧手三宝煲',
  'claypot stuffed tofu': 'claypot yong tau foo | 巧手三宝煲',
  'yong tau foo': 'claypot yong tau foo | 巧手三宝煲',
  'har cheong gai': 'prawn paste chicken | 虾酱鸡',
  'prawn paste chicken': 'prawn paste chicken | 虾酱鸡',
  'prawn paste chicken wings': 'prawn paste chicken | 虾酱鸡',
  'golden dragon chicken': 'golden dragon chicken | 脆皮金龙鸡',
  'kai lan roasted pork': 'kai lan stir fried with roasted pork | 芥兰炒烧肉',
  'kailan roast pork': 'kai lan stir fried with roasted pork | 芥兰炒烧肉',
  'prawn roll': 'prawn roll | 虾枣',
  'hae zor': 'prawn roll | 虾枣',
  'ngoh hiang': 'prawn roll | 虾枣',
  'bittergourd pork ribs': 'bittergourd pork ribs with black bean sauce | 苦瓜豉汁闷排骨',
  'bittergourd ribs': 'bittergourd pork ribs with black bean sauce | 苦瓜豉汁闷排骨',
  'curry fish head': 'curry fish head | 咖喱鱼头',
  'curry fish tail': 'curry fish tail | 咖喱鱼尾',
  'salted egg squid': 'salted egg squid | 咸蛋黄苏东',
  'salted egg prawn ball': 'salted egg prawn ball | 咸蛋黄虾球',
  'salted egg prawns': 'salted egg prawn ball | 咸蛋黄虾球',
  'moonlight hor fun': 'moonlight hor fun | 月光河粉',
  'sambal kang kong': 'sambal kang kong | 马来盏蕹菜',
  'sambal kangkong': 'sambal kang kong | 马来盏蕹菜',
  'cereal prawn': 'cereal prawn | 麦片虾',
  'cereal prawns': 'cereal prawn | 麦片虾',
  'black pepper crab': 'black pepper crab | 黑胡椒螃蟹',
  'chilli crab': 'chilli crab | 辣椒螃蟹',
  'white pepper crab': 'white pepper crab | 白胡椒螃蟹',
  'yang chow fried rice': 'yang zhou fried rice | 扬州炒饭',
  'yangzhou fried rice': 'yang zhou fried rice | 扬州炒饭',
  'san mee': 'crispy egg noodle (san mee) | 生面',
  'hokkien mee': 'fried hokkien mee | 福建面',
  'homemade tofu': 'homemade tofu with minced pork | 自制豆腐',
  'spring onion prawn': 'spring onion prawn(normal size) | 姜葱炒明虾',
  'spring onion prawn(normal size)': 'spring onion prawn(normal size) | 姜葱炒明虾',
  'spring onion normal size prawn': 'spring onion prawn(normal size) | 姜葱炒明虾',
  'spring onion medium size prawn': 'spring onion prawn(normal size) | 姜葱炒明虾',
};

/**
 * Resolves any dish query (name, code, ID, or bilingual object) to an authoritative canonical dish.
 * Returns null if no authentic match is found (never guesses or invents).
 */
/**
 * Resolves any dish query (name, code, ID, or bilingual object) to an authoritative canonical dish.
 * Prioritizes source_item_id when present, otherwise normalized exact English dish name plus category.
 * Chinese simplified/traditional differences do not reject an unambiguous match.
 * Returns null if no authentic match is found (never guesses or invents).
 */
export function resolveCanonicalDish(
  query: string | { nameEn?: string; nameZh?: string; id?: string; itemCode?: string; source_item_id?: string; category?: string }
): CanonicalDishInfo | null {
  initializeCatalog();
  const byIdentity = canonicalMapByIdentityCache!;
  const byCode = canonicalMapByCodeCache!;
  const byId = canonicalMapByIdCache!;
  const bySourceId = canonicalMapBySourceItemIdCache!;
  const byEnAndCat = canonicalMapByEnAndCatCache!;

  if (typeof query === 'object' && query !== null) {
    // 1. Primary rule: Match using the actual Oddle source_item_id when present
    if (query.source_item_id && bySourceId.has(query.source_item_id.toLowerCase())) {
      return bySourceId.get(query.source_item_id.toLowerCase())!;
    }

    // 2. Secondary rule: Match using normalized exact English dish name plus category
    if (query.nameEn && query.category) {
      const enKey = `${normalizeEnglishName(query.nameEn)}::${normalizeCategoryKey(query.category)}`;
      if (byEnAndCat.has(enKey)) {
        return byEnAndCat.get(enKey)!;
      }
    }

    // 3. Exact bilingual identity key match (with Chinese simplified/traditional normalization)
    if (query.nameEn && query.nameZh) {
      const key = normalizeDishIdentity(query.nameEn, query.nameZh);
      if (byIdentity.has(key)) return byIdentity.get(key)!;

      // Check if English matches and Chinese matches under simplified/traditional equivalence
      const normEn = normalizeEnglishName(query.nameEn);
      const normZh = normalizeChineseChars(query.nameZh);
      for (const dish of canonicalCatalogCache!) {
        if (normalizeEnglishName(dish.nameEn) === normEn && normalizeChineseChars(dish.nameZh) === normZh) {
          return dish;
        }
      }
    }

    // 4. Exact English name match (unambiguous)
    if (query.nameEn) {
      const res = resolveCanonicalDish(query.nameEn);
      if (res) return res;
    }

    // 5. Query by Oddle source_item_id if passed via id field
    if (query.id && bySourceId.has(query.id.toLowerCase())) {
      return bySourceId.get(query.id.toLowerCase())!;
    }

    // 6. Direct UI Code match (e.g. SIG1, CH2)
    if (query.itemCode && byCode.has(query.itemCode.toUpperCase())) {
      return byCode.get(query.itemCode.toUpperCase())!;
    }

    // 7. Direct UI ID match
    if (query.id && byId.has(query.id.toLowerCase())) {
      return byId.get(query.id.toLowerCase())!;
    }

    // 8. Chinese name match with traditional/simplified equivalence
    if (query.nameZh) {
      const res = resolveCanonicalDish(query.nameZh);
      if (res) return res;
    }

    return null;
  }

  const rawStr = String(query).trim();
  if (!rawStr) return null;

  // 1. Check if string is an exact source_item_id
  const lowerTrimmed = rawStr.toLowerCase();
  if (bySourceId.has(lowerTrimmed)) {
    return bySourceId.get(lowerTrimmed)!;
  }

  // 2. Direct code match (e.g. SIG1, N1, CH1)
  const upperTrimmed = rawStr.toUpperCase().replace(/\s+/g, '');
  if (byCode.has(upperTrimmed)) {
    return byCode.get(upperTrimmed)!;
  }

  // 3. Direct ID match
  if (byId.has(lowerTrimmed)) {
    return byId.get(lowerTrimmed)!;
  }

  // 4. Exact identity key match (accounting for Chinese simplified/traditional)
  const normKey = normalizeDishIdentity(rawStr.split('|')[0], rawStr.split('|')[1] || '');
  if (byIdentity.has(normKey)) {
    return byIdentity.get(normKey)!;
  }

  for (const [key, dish] of byIdentity.entries()) {
    if (key === lowerTrimmed) return dish;
  }

  // 5. Exact English name match (case-insensitive)
  const normInputEn = normalizeEnglishName(lowerTrimmed);
  for (const dish of canonicalCatalogCache!) {
    if (normalizeEnglishName(dish.nameEn) === normInputEn) {
      return dish;
    }
  }

  // 6. Exact Chinese name match with simplified/traditional normalization
  const rawZhNorm = normalizeChineseChars(rawStr.replace(/[^\u4e00-\u9fa5]/g, ''));
  if (rawZhNorm.length >= 2) {
    for (const dish of canonicalCatalogCache!) {
      const dishZhNorm = normalizeChineseChars(dish.nameZh);
      if (dishZhNorm.includes(rawZhNorm) || rawZhNorm.includes(dishZhNorm)) {
        return dish;
      }
    }
  }

  // 7. Check curated canonical aliases
  if (CANONICAL_ALIASES[normInputEn]) {
    const aliasKey = CANONICAL_ALIASES[normInputEn];
    if (byIdentity.has(aliasKey)) return byIdentity.get(aliasKey)!;
  }

  // 8. High-confidence boundary match: dish name fully contained in query or query matches start of dish
  for (const dish of canonicalCatalogCache!) {
    const dishEnNorm = normalizeEnglishName(dish.nameEn);
    // Only accept if at least 10 chars or 2 distinct words to avoid generic word collisions
    if (dishEnNorm.length >= 10 && (normInputEn.includes(dishEnNorm) || dishEnNorm.includes(normInputEn))) {
      return dish;
    }
  }

  return null;
}

/**
 * Validates, resolves, deduplicates, and filters a list of recommended dishes.
 * Excludes dishes already suggested unless explicitly marked to revisit.
 */
export function validateAndDeduplicateRecommendations(
  candidates: Array<{ nameEn?: string; nameZh?: string; id?: string; itemCode?: string } | string>,
  excludedKeys: string[] = [],
  allowRevisit = false
): MenuItem[] {
  const result: MenuItem[] = [];
  const seenInResponse = new Set<string>();
  const excludedSet = new Set(excludedKeys.map((k) => k.trim().toLowerCase()));

  for (const candidate of candidates) {
    const resolved = resolveCanonicalDish(candidate);
    if (!resolved) {
      // Discard invalid / invented dishes
      continue;
    }

    const { identityKey } = resolved;
    if (seenInResponse.has(identityKey)) {
      // Deduplicate inside same response
      continue;
    }

    if (!allowRevisit && excludedSet.has(identityKey.toLowerCase())) {
      // Exclude dishes already recommended earlier in conversation
      continue;
    }

    seenInResponse.add(identityKey);
    // Return the authoritative MenuItem
    result.push({
      ...resolved.canonicalMenuItem,
      // Ensure identityKey is preserved for unique stable React keys
      id: resolved.canonicalMenuItem.id,
    });
  }

  return result;
}

/**
 * Safely extracts authentic Kok Sen dishes referenced in free text.
 * Strictly matches full canonical dish titles or specific multi-word aliases.
 */
export function detectDishesInTextSafely(
  text: string,
  excludedKeys: string[] = [],
  allowRevisit = false
): MenuItem[] {
  if (!text) return [];
  const candidates: CanonicalDishInfo[] = [];
  const textLower = text.toLowerCase();

  const dishes = getCanonicalDishes();
  for (const dish of dishes) {
    const nameEnLower = dish.nameEn.toLowerCase();
    const nameZhClean = dish.nameZh.replace(/\s+/g, '');

    // Require specific matches: full English name or full Chinese name or itemCode
    const hasEnMatch = nameEnLower.length >= 6 && textLower.includes(nameEnLower);
    const hasZhMatch = nameZhClean.length >= 3 && text.includes(nameZhClean);
    const hasCodeMatch = dish.itemCodes.some(
      (code) => code.length >= 3 && new RegExp(`\\b${code}\\b`, 'i').test(text)
    );

    if (hasEnMatch || hasZhMatch || hasCodeMatch) {
      candidates.push(dish);
    }
  }

  return validateAndDeduplicateRecommendations(
    candidates.map((c) => ({ nameEn: c.nameEn, nameZh: c.nameZh })),
    excludedKeys,
    allowRevisit
  );
}

/**
 * Builds an authoritative, price-free text catalog of all 110 dishes
 * for system instructions.
 */
export function generatePromptCatalog(): string {
  const dishes = getCanonicalDishes();
  const byCategory = new Map<string, CanonicalDishInfo[]>();

  for (const dish of dishes) {
    for (const cat of dish.categories) {
      if (!byCategory.has(cat)) byCategory.set(cat, []);
      byCategory.get(cat)!.push(dish);
    }
  }

  const sections: string[] = [];

  for (const catDef of MENU_CATEGORIES) {
    if (catDef.id === 'all') continue;
    const catDishes = byCategory.get(catDef.id) || [];
    if (catDishes.length === 0) continue;

    const dishLines = catDishes.map((d) => {
      const codeStr = d.itemCodes[0] ? ` [${d.itemCodes[0]}]` : '';
      return `• ${d.nameEn} (${d.nameZh})${codeStr}: ${d.description || 'Authentic Kok Sen kitchen preparation.'}`;
    });

    sections.push(`### Category: ${catDef.nameEn} (${catDef.nameZh})\n${dishLines.join('\n')}`);
  }

  return sections.join('\n\n');
}
