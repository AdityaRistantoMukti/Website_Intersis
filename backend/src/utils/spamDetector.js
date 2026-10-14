/**
 * Utility: spamDetector.js
 * Evaluates RFQ inquiries for gibberish, spam patterns, disposable emails, and bot traps.
 */

const KEYBOARD_SEQUENCES = [
  'asdf', 'sdfg', 'dfgh', 'fghj', 'ghjk', 'hjkl',
  'qwerty', 'werty', 'ertyu', 'rtyui', 'tyuio', 'yuio',
  'zxcv', 'xcvb', 'cvbn', 'vbnm',
  'qazwsx', 'wsxedc', 'edcrfv',
  '12345', '23456', '34567', '45678', '56789',
];

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com',
  '10minutemail.com',
  'mailinator.com',
  'guerrillamail.com',
  'throwawaymail.com',
  'trashmail.com',
  'sharklasers.com',
  'dispostable.com',
  'yopmail.com',
  'nada.ltd',
  'getnada.com',
  'fakeinbox.com',
  'burnermail.io',
  'temp-mail.org',
  'mytemp.email',
]);

/**
 * Checks if a string contains keyboard smash / gibberish patterns
 */
function isGibberish(text) {
  if (!text || typeof text !== 'string') return false;
  const clean = text.toLowerCase().trim();
  if (clean.length < 3) return false;

  // 1. Check for 4+ consecutive identical characters (e.g. 'aaaa', 'zzzz')
  if (/(.)\1{3,}/.test(clean)) {
    return true;
  }

  // 2. Check for common keyboard mash sequences
  for (const seq of KEYBOARD_SEQUENCES) {
    if (clean.includes(seq)) {
      return true;
    }
  }

  // 3. Check for words of 5+ letters with 4+ consecutive consonants (rare in Indo/Eng)
  const words = clean.split(/\s+/);
  for (const w of words) {
    const lettersOnly = w.replace(/[^a-z]/g, '');
    if (lettersOnly.length >= 5) {
      // 4+ consonants in a row
      if (/[bcdfghjklmnpqrstvwxyz]{4,}/i.test(lettersOnly)) {
        return true;
      }
      // Vowel ratio: words with length >= 6 and 0 vowels
      const vowels = lettersOnly.match(/[aeiou]/gi) || [];
      if (lettersOnly.length >= 6 && vowels.length === 0) {
        return true;
      }
      // Extreme vowel deficiency in long words (e.g. 7 letters with only 1 vowel like 'ksakdqk')
      if (lettersOnly.length >= 7 && vowels.length <= 1) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if a phone number is synthetic / fake
 */
function evaluatePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, score: 40, reason: 'Nomor telepon tidak diisi' };
  }

  const trimmed = phone.trim();

  // If contains letters
  if (/[a-zA-Z]/.test(trimmed)) {
    return { valid: false, score: 50, reason: 'Nomor telepon mengandung huruf acak' };
  }

  const digits = trimmed.replace(/\D/g, '');

  // Length check: legitimate international/Indonesian phone numbers are between 8 and 16 digits
  if (digits.length < 8 || digits.length > 16) {
    return { valid: false, score: 35, reason: 'Panjang nomor telepon tidak lazim (<8 atau >16 digit)' };
  }

  // All identical digits (e.g. 081111111111, 000000000)
  if (/^(\d)\1+$/.test(digits)) {
    return { valid: false, score: 50, reason: 'Nomor telepon tersusun dari angka yang sama semua' };
  }

  // Obvious sequential digits (e.g. 1234567890, 0123456789, 9876543210)
  const isPureSequence =
    digits === '1234567890' ||
    digits === '0123456789' ||
    digits === '01234567890' ||
    digits === '9876543210' ||
    digits === '0987654321' ||
    digits === '123456789' ||
    digits === '987654321';
  if (isPureSequence) {
    return { valid: false, score: 50, reason: 'Nomor telepon merupakan urutan angka tiruan (123456789)' };
  }

  return { valid: true, score: 0 };
}

/**
 * Main evaluation function for an RFQ submission
 */
function evaluateRfqSpam({
  fullName = '',
  corporateEmail = '',
  companyName = '',
  phone = '',
  message = '',
  honeypot = '',
}) {
  let spamScore = 0;
  const reasons = [];

  // 1. Honeypot check (Highest priority: silent bot trap)
  if (honeypot && String(honeypot).trim().length > 0) {
    spamScore += 100;
    reasons.push('Jebakan bot (Honeypot trap) terpicu');
  }

  // 2. Full Name checks
  const cleanName = fullName.trim();
  if (cleanName.length < 2) {
    spamScore += 30;
    reasons.push('Nama pemohon terlalu pendek');
  } else if (isGibberish(cleanName)) {
    spamScore += 45;
    reasons.push('Nama terindikasi teks acak / keyboard smash');
  }

  // 3. Company Name checks
  const cleanCompany = companyName.trim();
  if (cleanCompany.length < 2) {
    spamScore += 25;
    reasons.push('Nama perusahaan terlalu pendek');
  } else if (isGibberish(cleanCompany)) {
    spamScore += 40;
    reasons.push('Nama perusahaan terindikasi teks acak');
  }

  // 4. Phone Number checks
  const phoneEval = evaluatePhone(phone);
  if (!phoneEval.valid) {
    spamScore += phoneEval.score;
    reasons.push(phoneEval.reason);
  }

  // 5. Corporate Email checks
  const cleanEmail = corporateEmail.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    spamScore += 40;
    reasons.push('Format email tidak valid');
  } else {
    const parts = cleanEmail.split('@');
    const domain = parts[1] || '';
    const username = parts[0] || '';

    // Check disposable domain
    if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
      spamScore += 60;
      reasons.push(`Domain email sementara (${domain}) terdeteksi`);
    }

    // Check if username part is obvious gibberish
    if (isGibberish(username)) {
      spamScore += 35;
      reasons.push('Alamat email terindikasi karakter acak');
    }
  }

  // 6. Message checks
  if (message && typeof message === 'string') {
    const cleanMsg = message.trim();
    if (cleanMsg.length > 0 && cleanMsg.length < 5) {
      spamScore += 20;
      reasons.push('Pesan deskripsi kebutuhan terlalu pendek (< 5 karakter)');
    } else if (cleanMsg.length > 0 && isGibberish(cleanMsg)) {
      spamScore += 35;
      reasons.push('Isi pesan terindikasi teks acak');
    }
  }

  // Cap spamScore at 100
  spamScore = Math.min(spamScore, 100);

  // Threshold: >= 50 points = SPAM
  const isSpam = spamScore >= 50;

  return {
    isSpam,
    spamScore,
    reasons,
    primaryReason: reasons.length > 0 ? reasons[0] : null,
  };
}

module.exports = {
  evaluateRfqSpam,
  isGibberish,
  evaluatePhone,
};
