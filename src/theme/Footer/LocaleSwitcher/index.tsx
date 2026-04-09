import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';
import { Globe, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import './styles.css';

export default function FooterLocaleSwitcher() {
  const {
    siteConfig: { i18n },
    i18n: { currentLocale, localeConfigs },
  } = useDocusaurusContext();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  // Filter out the current locale from the list of options
  const otherLocales = i18n.locales.filter((l) => l !== currentLocale);
  const currentLocaleConfig = localeConfigs[currentLocale];

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const getLocalePath = (targetLocale: string) => {
    // Standard Docusaurus locale path mapping
    const isDefaultLocale = targetLocale === i18n.defaultLocale;
    const pathWithoutLocale = currentLocale === i18n.defaultLocale 
      ? pathname 
      : pathname.replace(`/${currentLocale}`, '') || '/';
    
    const prefix = isDefaultLocale ? '' : `/${targetLocale}`;
    return `${prefix}${pathWithoutLocale}`.replace(/\/+/g, '/') || '/';
  };

  return (
    <div className="footer-locale-switcher">
      <button 
        className={clsx('footer-locale-switcher__button', isOpen && 'active')} 
        onClick={(e) => {
          e.stopPropagation();
          toggleDropdown();
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe size={16} />
        <span>{currentLocaleConfig.label}</span>
        <ChevronUp size={14} className={clsx('chevron', isOpen && 'open')} />
      </button>

      {isOpen && (
        <ul className="footer-locale-switcher__menu">
          {otherLocales.map((locale) => (
            <li key={locale}>
              <a 
                href={getLocalePath(locale)}
                className="footer-locale-switcher__link"
              >
                {localeConfigs[locale].label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
