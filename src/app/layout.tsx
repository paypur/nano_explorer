import '@/styles/globals.css'
import SearchBar from '@/components/SearchBar'

import { Roboto } from "next/font/google"

const roboto = Roboto({
    weight: ['300', '400'],
    subsets: ['latin']
})

export default function RootLayout({children}: {children: React.ReactNode}) {
    
    return (
        <html lang="en">
            <body className={roboto.className}>
                <div className='px-24'>
                    <p className='my-6 text-3xl font-normal text-center'>Nanvigator</p>
                    <SearchBar/>
                    {children}
                </div>
            </body>
        </html>
    )
}
