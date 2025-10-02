import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Set initial theme before paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const ls = localStorage.getItem('theme'); const mql = window.matchMedia('(prefers-color-scheme: dark)').matches; const t = ls ?? (mql ? 'dark' : 'light'); const root = document.documentElement; if (t === 'dark') root.classList.add('dark'); else root.classList.remove('dark'); } catch (_) {} })();`,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
