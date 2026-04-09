import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import FooterLocaleSwitcher from '../LocaleSwitcher';
export default function FooterLayout({style, links, logo, copyright}) {
  return (
    <footer
      className={clsx(ThemeClassNames.layout.footer.container, 'footer', {
        'footer--dark': style === 'dark',
      })}>
      <div className="container container-fluid footer__content">
        <div className="footer__links_wrapper">{links}</div>
        {(logo || copyright || true) && (
          <div className="footer__bottom_modern">
            <div className="footer__bottom_modern--left">
              {logo && <div className="footer__logo_container">{logo}</div>}
              {copyright && <div className="footer__copyright_container">{copyright}</div>}
            </div>
            <div className="footer__bottom_modern--right">
              <FooterLocaleSwitcher />
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
