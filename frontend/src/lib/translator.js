import api from './api';

/**
 * Translate a single string, array of strings, or deep object from Indonesian to English
 * via backend POST /api/admin/translate
 */
export async function translateContent(input) {
  try {
    if (!input) return input;

    let payload = {};
    if (typeof input === 'string') {
      payload = { text: input, sl: 'id', tl: 'en' };
    } else if (Array.isArray(input)) {
      payload = { texts: input, sl: 'id', tl: 'en' };
    } else if (typeof input === 'object') {
      payload = { data: input, sl: 'id', tl: 'en' };
    }

    const res = await api.post('/admin/translate', payload);
    if (res?.data?.data) {
      if (typeof input === 'string') return res.data.data.text || input;
      if (Array.isArray(input)) return res.data.data.texts || input;
      return res.data.data.data || input;
    }
    return input;
  } catch (err) {
    console.warn('Failed to translate content via API, fallback to original:', err);
    return input;
  }
}

/**
 * Fallback localized field extractor for public pages:
 * Given a settings object and current lang ('id' | 'en'):
 * returns content[lang] || content['id'] || content
 */
export function getLocalizedData(settingOrObj, lang = 'id') {
  if (!settingOrObj) return settingOrObj;
  
  // If stored with { id: {...}, en: {...} } structure
  if (settingOrObj[lang] !== undefined) {
    return settingOrObj[lang];
  }
  if (settingOrObj.id !== undefined && typeof settingOrObj.id === 'object') {
    return settingOrObj.id;
  }
  return settingOrObj;
}
