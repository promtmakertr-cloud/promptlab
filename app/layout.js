import './globals.css'
import Header from '@/components/Header'

export const metadata = {
  title: 'PromptLab | AI Komuta Merkezi',
  description: 'Fikirlerini güçlü promptlara dönüştür.',
}

// 🔥 IPHONE ZOOM SORUNUNU ÇÖZEN KISIM BURASI 🔥
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, backgroundColor: '#050505', fontFamily: 'Inter, sans-serif' }}>
        <Header />
        {children}
      </body>
    </html>
  )
}
