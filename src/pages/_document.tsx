import { Html, Head, Main, NextScript } from 'next/document'
import i18nextConfig from '../../next-i18next.config'
 
export default function Document(props: any) {
  const currentLocale =
      props.__NEXT_DATA__.query.locale ||
      i18nextConfig.i18n.defaultLocale
  return (
    <Html lang={currentLocale}>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_TITLE}</title>
        <meta name="description" content=""/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}