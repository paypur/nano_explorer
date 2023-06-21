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

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${roboto.variable} ${roboto_mono.variable}`}>
            <body className='flex justify-center bg-black font-sans font-light text-lg text-slate-50 antialiased'>
                <div className='w-[93.625rem] min-w-0 mx-16'>
                    <p className='my-8 text-4xl font-normal text-center'>NANVIGATOR</p>
                    <SearchBar />
                    {children}
                </div>
            </body>
        </html>
    )
}
