import '@/styles/globals.css'
import SearchBar from '@/components/SearchBar'

import { Roboto, Roboto_Mono } from "next/font/google"

const roboto = Roboto({
    weight: ['300', '400'],
    subsets: ['latin'],
    variable: '--font-roboto',
})

const roboto_mono = Roboto_Mono({
    weight: ['300', '400'],
    subsets: ['latin'],
    variable: '--font-roboto-mono',
})

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en" className={`${roboto.variable} ${roboto_mono.variable}`}>
            <body className='bg-black'>
                <div className='px-16 font-sans font-light text-lg text-slate-50'>
                    <p className='my-6 text-3xl font-normal text-center'>NANVIGATOR</p>
                    <SearchBar/>
                    {children}
                </div>
            </body>
        </html>
    )
}
