import type { Metadata } from 'next'
import 'primereact/resources/themes/lara-light-blue/theme.css';
import './globals.css'
import 'primeicons/primeicons.css';     
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';


export const metadata: Metadata = {
  title: 'Shopping List',
  description: ''
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PrimeReactProvider>
    <html lang="en">
      <body className='bg-black' >{children}</body>
    </html>
    </PrimeReactProvider>
  )
}

// export const dynamic = 'force-dynamic';