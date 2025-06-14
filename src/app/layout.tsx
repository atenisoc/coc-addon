import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="text-white min-h-screen">{children}</body>
    </html>
  )
}
