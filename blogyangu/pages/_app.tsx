// pages/_app.tsx
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import '../app/globals.css'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { Navbar } from '@/components/layout/Navbar'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <div className="min-h-dvh bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
          <Navbar />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Component {...pageProps} />
          </main>
        </div>
      </ThemeProvider>
    </SessionProvider>
  )
}
