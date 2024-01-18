import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LMS - Learning Management System',
  description: 'Plataforma para gerenciamento de cursos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="pt">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
