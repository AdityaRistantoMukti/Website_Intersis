import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

export default function Navbar() {
  const { t, i18n } = useTranslation('common');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  // Shrink navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('gpt-lang', lang); // remember user's manual choice
    setLangOpen(false);
  };

  const navLinks = [
    { to: '/',           label: t('nav.home') },
    { to: '/about',      label: t('nav.about') },
    { to: '/automation', label: t('nav.automation') },
    { to: '/products',   label: t('nav.products') },
    { to: '/gallery',    label: t('nav.gallery') },
    { to: '/career',     label: t('nav.career') },
    { to: '/contact',    label: t('nav.contact') },
  ];

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <nav className="container navbar__inner">
        {/* Official Company Logo */}
        <Link to="/" className="navbar__logo" aria-label="PT Global Philsonic Technologies Home">
          <div className="navbar__logo-badge">
            <img
              src="/images/logo_company.jpg"
              alt="PT Global Philsonic Technologies"
              className="navbar__logo-img"
            />
          </div>
          <div className="navbar__logo-meta">
            <span className="navbar__logo-gpt">GPT</span>
            <span className="navbar__logo-sub">Global Philsonic Technologies </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="navbar__links">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `navbar__link${isActive ? ' navbar__link--active' : ''}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Language Selector & Mobile Toggle */}
        <div className="navbar__actions">
          {/* Language Switcher */}
          <div className="lang-switcher">
            <button
              type="button"
              className="lang-switcher__btn"
              onClick={() => setLangOpen(!langOpen)}
              aria-expanded={langOpen}
              aria-label="Select language"
            >
              <span className="lang-switcher__current">{i18n.language.toUpperCase()}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`lang-switcher__chevron${langOpen ? ' lang-switcher__chevron--open' : ''}`}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {langOpen && (
              <div className="lang-switcher__dropdown">
                <button
                  type="button"
                  className={`lang-switcher__option${i18n.language === 'id' ? ' lang-switcher__option--active' : ''}`}
                  onClick={() => changeLanguage('id')}
                >
                  <span className="lang-flag">🇮🇩</span> Bahasa Indonesia
                </button>
                <button
                  type="button"
                  className={`lang-switcher__option${i18n.language === 'en' ? ' lang-switcher__option--active' : ''}`}
                  onClick={() => changeLanguage('en')}
                >
                  <span className="lang-flag">🇬🇧</span> English
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className={`navbar__hamburger${menuOpen ? ' navbar__hamburger--active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span className="navbar__hamburger-bar" />
            <span className="navbar__hamburger-bar" />
            <span className="navbar__hamburger-bar" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`navbar__mobile${menuOpen ? ' navbar__mobile--open' : ''}`}>
        <ul className="navbar__mobile-links">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `navbar__mobile-link${isActive ? ' navbar__mobile-link--active' : ''}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
