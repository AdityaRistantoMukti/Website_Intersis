const { success, error } = require('../../utils/response');

const DELIMITER = '\n[[[SEP]]]\n';
const DELIMITER_REGEX = /\[\[\[SEP\]\]\]/i;

/**
 * Translate a single or batched text string using Google Translate GTX endpoint
 */
async function fetchGoogleTranslate(text, sl = 'id', tl = 'en') {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return text;
  }
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sl)}&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Translation request returned HTTP ${response.status}`);
      return text;
    }
    const json = await response.json();
    if (Array.isArray(json) && Array.isArray(json[0])) {
      return json[0].map((chunk) => chunk[0] || '').join('');
    }
    return text;
  } catch (err) {
    console.error('Translation error:', err.message);
    return text;
  }
}

/**
 * Translate an array of strings in ONE single HTTP request
 */
async function translateStringsBatch(strings, sl = 'id', tl = 'en') {
  if (!Array.isArray(strings) || strings.length === 0) return [];
  
  // If only 1 string
  if (strings.length === 1) {
    const res = await fetchGoogleTranslate(strings[0], sl, tl);
    return [res];
  }

  // Join by unique delimiter
  const combined = strings.join(DELIMITER);
  const translatedCombined = await fetchGoogleTranslate(combined, sl, tl);

  // Split back
  const parts = translatedCombined.split(DELIMITER_REGEX).map((p) => p.trim());

  // If length matches, return parts; otherwise fallback gracefully
  if (parts.length === strings.length) {
    return parts;
  }

  // If split mismatch, fallback to sequential
  const fallbackResults = [];
  for (const s of strings) {
    const res = await fetchGoogleTranslate(s, sl, tl);
    fallbackResults.push(res);
  }
  return fallbackResults;
}

/**
 * Translate an entire object deeply in a single batch call
 */
async function translateDeepObject(target, sl = 'id', tl = 'en') {
  // Step 1: Collect all string paths that should be translated
  const stringEntries = [];

  function collect(item, path = []) {
    if (typeof item === 'string') {
      // Check if it should be skipped
      if (
        item.startsWith('http://') ||
        item.startsWith('https://') ||
        item.startsWith('/') ||
        item.startsWith('#') ||
        /^[0-9+., %-]+$/.test(item) ||
        item.includes('@')
      ) {
        return;
      }
      stringEntries.push({ path, value: item });
    } else if (Array.isArray(item)) {
      item.forEach((sub, i) => collect(sub, [...path, i]));
    } else if (item !== null && typeof item === 'object') {
      Object.keys(item).forEach((k) => {
        // Skip technical keys
        if (!['id', 'url', 'image', 'bgImage', 'icon', 'link', 'slug', 'suffix', 'buttonLink', 'actionLink', 'type'].includes(k)) {
          collect(item[k], [...path, k]);
        }
      });
    }
  }

  collect(target);

  if (stringEntries.length === 0) {
    return JSON.parse(JSON.stringify(target));
  }

  // Step 2: Batch translate all collected strings
  const originalStrings = stringEntries.map((e) => e.value);
  const translatedStrings = await translateStringsBatch(originalStrings, sl, tl);

  // Step 3: Clone target and reassign translated strings
  const cloned = JSON.parse(JSON.stringify(target));

  function setDeep(obj, path, value) {
    let curr = obj;
    for (let i = 0; i < path.length - 1; i++) {
      curr = curr[path[i]];
    }
    curr[path[path.length - 1]] = value;
  }

  stringEntries.forEach((entry, idx) => {
    const translatedVal = translatedStrings[idx] !== undefined ? translatedStrings[idx] : entry.value;
    setDeep(cloned, entry.path, translatedVal);
  });

  return cloned;
}

/**
 * POST /api/admin/translate
 * Translates text, array of texts, or deep data objects from ID to EN (or specified sl/tl)
 */
const translateContent = async (req, res, next) => {
  try {
    const { text, texts, data, sl = 'id', tl = 'en' } = req.body;

    if (text !== undefined) {
      const translated = await fetchGoogleTranslate(text, sl, tl);
      return success(res, 'Teks berhasil diterjemahkan.', { text: translated });
    }

    if (Array.isArray(texts)) {
      const translatedList = await translateStringsBatch(texts, sl, tl);
      return success(res, 'Daftar teks berhasil diterjemahkan.', { texts: translatedList });
    }

    if (data !== undefined && typeof data === 'object') {
      const translatedData = await translateDeepObject(data, sl, tl);
      return success(res, 'Data objek berhasil diterjemahkan.', { data: translatedData });
    }

    return error(res, 'Parameter text, texts, atau data wajib disertakan.', 400);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  translateContent,
  fetchGoogleTranslate,
  translateStringsBatch,
  translateDeepObject,
};
