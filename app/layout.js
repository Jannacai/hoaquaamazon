import '@/styles/globals.css'
import { AuthProvider } from '@/context/AuthContext'

export const metadata = {
    title: 'Trái Cây Xanh Tươi',
    description: 'Website bán trái cây tươi ngon chất lượng cao',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="vi">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Libre+Bodoni:ital,wght@0,400..700;1,400..700&display=swap"
                    rel="stylesheet"
                />

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Libre+Bodoni:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
            </head>
            <body>
                <AuthProvider>
                    <div id="root">
                        {children}
                    </div>
                </AuthProvider>
            </body>
        </html>
    )
}
