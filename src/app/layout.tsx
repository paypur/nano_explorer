import SearchBar from '@/components/SearchBar'
import '@/styles/globals.css'

import { Roboto } from "next/font/google"

const roboto = Roboto({
    weight: ['300'],
    subsets: ['latin']
})

export default function RootLayout({children}: {children: React.ReactNode}) {
    
    return (
        <html lang="en">
            <body className={roboto.className}>
                <div className='px-12'>
                    <p className='my-6 text-3xl text-center'>Nanvigator</p>
                    <SearchBar></SearchBar>
                    {children}
                </div>
            </body>
        </html>
    )
}
