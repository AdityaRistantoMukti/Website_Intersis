import { Languages, Sparkles } from 'lucide-react';
import './LanguageTabControl.css';

/**
 * Reusable Language Switcher and Auto-Translate Controller for Admin CMS
 * Strict Rule: No emojis used, only SVG icons and clean industrial badges.
 */
export default function LanguageTabControl({
  activeLang,
  onSelectLang,
  onTranslate,
  isTranslating = false,
  label = 'Bahasa Konten',
}) {
  return (
    <div className="admin-lang-control">
      <div className="admin-lang-control__left">
        <span className="admin-lang-control__label">{label}:</span>
        <div className="admin-lang-control__tabs">
          <button
            type="button"
            className={`admin-lang-pill ${activeLang === 'id' ? 'admin-lang-pill--active' : ''}`}
            onClick={() => onSelectLang('id')}
          >
            <span className="admin-lang-code">ID</span>
            <span className="admin-lang-name">Bahasa Indonesia</span>
          </button>
          <button
            type="button"
            className={`admin-lang-pill ${activeLang === 'en' ? 'admin-lang-pill--active' : ''}`}
            onClick={() => onSelectLang('en')}
          >
            <span className="admin-lang-code">EN</span>
            <span className="admin-lang-name">English</span>
          </button>
        </div>
      </div>

      <div className="admin-lang-control__right">
        <button
          type="button"
          className="admin-translate-btn"
          onClick={onTranslate}
          disabled={isTranslating}
          title="Otomatis terjemahkan teks dari Bahasa Indonesia ke English (dapat diedit manual)"
        >
          {isTranslating ? (
            <>
              <div className="admin-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
              <span>Menerjemahkan ke EN...</span>
            </>
          ) : (
            <>
              <Languages size={15} />
              <span>Terjemahkan Otomatis (ID ke EN)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
