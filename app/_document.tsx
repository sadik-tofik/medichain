import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add any head elements here */}
        <link rel="preload" href="/_next/static/wasm/sidan_csl_rs_bg.wasm" as="fetch" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
