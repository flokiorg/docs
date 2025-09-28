import React from 'react';
import type { Props } from '@theme/Root';
import Head from '@docusaurus/Head';

export default function Root({children}: Props): JSX.Element {
  return (
    <>
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
