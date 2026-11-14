import React, { useEffect } from 'react';
import type { Props } from '@theme/Root';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';

const SUPPORTED_LOCALES = ['cn', 'fa', 'ar', 'fr', 'es'] as const;
const PREF_KEY = 'docusaurus.preferredLocale';

// Maps navigator.language prefixes to Docusaurus locale codes.
const LOCALE_MAP: Record<string, string> = {
  zh: 'cn',
  fa: 'fa',
  ar: 'ar',
  fr: 'fr',
  es: 'es',
};

function detectLocale(languages: readonly string[]): string {
  for (const lang of languages) {
    const prefix = lang.split('-')[0].toLowerCase();
    const full = lang.toLowerCase();
    // Exact match first (e.g. zh-CN), then prefix match (e.g. zh → zh-CN)
    if (LOCALE_MAP[full]) return LOCALE_MAP[full];
    if (LOCALE_MAP[prefix]) return LOCALE_MAP[prefix];
  }
  return 'en';
}

function getCurrentLocale(pathname: string): string {
  for (const locale of SUPPORTED_LOCALES) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  return 'en';
}

function useLocaleAutoRedirect() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentLocale = getCurrentLocale(pathname);
    const saved = localStorage.getItem(PREF_KEY);
    const hasBeenRedirected = sessionStorage.getItem('docusaurus.redirected');

    // If we're on a non-default locale (e.g., /fr/), update the saved preference
    // and stop the redirection loop potential for this session.
    if (currentLocale !== 'en') {
      if (saved !== currentLocale) {
        localStorage.setItem(PREF_KEY, currentLocale);
      }
      return;
    }

    // Default locale (English /) logic:
    if (pathname === '/' && saved && saved !== 'en' && !hasBeenRedirected) {
      // Automatic initial redirect from root to preference
      sessionStorage.setItem('docusaurus.redirected', 'true');
      window.location.replace(`/${saved}/`);
    } else if (!saved && pathname === '/' && !hasBeenRedirected) {
      // First visit ever: detect from browser
      const detected = detectLocale(navigator.languages || [navigator.language]);
      localStorage.setItem(PREF_KEY, detected);
      
      if (detected !== 'en') {
        sessionStorage.setItem('docusaurus.redirected', 'true');
        window.location.replace(`/${detected}/`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
}

export default function Root({ children }: Props): JSX.Element {
  useLocaleAutoRedirect();

  return (
    <>
      {/* @ts-expect-error: Docusaurus Head type conflict with local React types */}
      <Head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Lokiwiki" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      {children}
    </>
  );
}
