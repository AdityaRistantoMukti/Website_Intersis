import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { getImageUrl } from '../lib/api';

const BrandingContext = createContext(null);

export const DEFAULT_BRANDING = {
  site_name: 'PT. Global Philsonic Technologies',
  tagline: 'Automotive Electronics & Industrial Automation',
  logo_url: '/images/logo_company.jpg',
  favicon_url: '/favicon.ico',
  meta_title_separator: '|',
  title_format: 'per_page',
};

export function BrandingProvider({ children }) {
  const [branding, setBranding] = useState(() => {
    try {
      const cached = localStorage.getItem('gpt_site_branding');
      return cached ? JSON.parse(cached) : DEFAULT_BRANDING;
    } catch {
      return DEFAULT_BRANDING;
    }
  });
  const [loading, setLoading] = useState(false);

  // Apply favicon dynamically to browser tab DOM (with Chrome cache-busting)
  const applyFavicon = useCallback((faviconPath) => {
    if (!faviconPath) return;
    const resolvedUrl = getImageUrl(faviconPath);

    // Remove existing favicon links to force browser re-eval
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach((el) => el.remove());

    const cacheBuster = (resolvedUrl.startsWith('data:') || resolvedUrl.startsWith('blob:'))
      ? resolvedUrl
      : `${resolvedUrl}${resolvedUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;

    // Standard rel="icon"
    const link = document.createElement('link');
    link.id = 'app-favicon';
    link.rel = 'icon';
    link.type = resolvedUrl.endsWith('.ico') ? 'image/x-icon' : (resolvedUrl.endsWith('.png') ? 'image/png' : 'image/jpeg');
    link.href = cacheBuster;
    document.head.appendChild(link);

    // Microsoft & legacy Chrome rel="shortcut icon"
    const shortcut = document.createElement('link');
    shortcut.rel = 'shortcut icon';
    shortcut.type = link.type;
    shortcut.href = cacheBuster;
    document.head.appendChild(shortcut);
  }, []);

  const refreshBranding = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/public/site-settings/site_branding');
      const data = res.data?.data;
      if (data && typeof data === 'object') {
        const merged = { ...DEFAULT_BRANDING, ...data };
        setBranding(merged);
        try {
          localStorage.setItem('gpt_site_branding', JSON.stringify(merged));
        } catch {}
        applyFavicon(merged.favicon_url);
      }
    } catch {
      // Keep existing or default branding
    } finally {
      setLoading(false);
    }
  }, [applyFavicon]);

  useEffect(() => {
    refreshBranding();
  }, [refreshBranding]);

  // Ensure favicon is applied on mount
  useEffect(() => {
    if (branding?.favicon_url) {
      applyFavicon(branding.favicon_url);
    }
  }, [branding?.favicon_url, applyFavicon]);

  return (
    <BrandingContext.Provider value={{ branding, setBranding, refreshBranding, loading, applyFavicon }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const ctx = useContext(BrandingContext);
  if (!ctx) {
    return {
      branding: DEFAULT_BRANDING,
      refreshBranding: () => {},
      loading: false,
      applyFavicon: () => {},
    };
  }
  return ctx;
}
