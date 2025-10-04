// Rundex CRM - Кастомный документ Next.js
// Автор: MagistrTheOne, 2025

import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Manifest для PWA */}
        <link rel="manifest" href="/manifest.json" />

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/favicon.ico" />

        {/* Theme Color для мобильных браузеров */}
        <meta name="theme-color" content="#7B61FF" />
        <meta name="msapplication-TileColor" content="#7B61FF" />

        {/* Open Graph мета-теги */}
        <meta property="og:title" content="Rundex CRM" />
        <meta property="og:description" content="Комплексная CRM система для управления бизнесом" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content={process.env.NEXTAUTH_URL || 'http://localhost:3000'} />

        {/* Twitter Card мета-теги */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rundex CRM" />
        <meta name="twitter:description" content="Комплексная CRM система для управления бизнесом" />
        <meta name="twitter:image" content="/og-image.png" />

        {/* Viewport и другие мета-теги */}
        <meta name="description" content="Комплексная CRM система для управления бизнесом, лидами, сделками и аналитикой" />
        <meta name="keywords" content="CRM, управление продажами, лиды, сделки, аналитика, бизнес" />
        <meta name="author" content="MagistrTheOne" />

        {/* Предзагрузка шрифтов если нужно */}
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />

        {/* Регистрация Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </Html>
  )
}
