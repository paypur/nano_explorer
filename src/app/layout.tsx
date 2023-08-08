import '@/styles/globals.css'
import SearchBar from '@/components/SearchBar'

import { Roboto, Roboto_Mono } from "next/font/google"
import Background from '@/components/Background'


const roboto = Roboto({
    weight: ['300', '400', '500'],
    subsets: ['latin'],
    variable: '--font-roboto',
})

const roboto_mono = Roboto_Mono({
    weight: ['300', '400', '500'],
    subsets: ['latin'],
    variable: '--font-roboto-mono',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${roboto.variable} ${roboto_mono.variable}`}>
            <body className='flex justify-center bg-black font-sans font-normal text-base text-gray-100 antialiased'>
                <div className='flex flex-col items-center min-w-0 mx-16'>
                    <p className='my-8 text-4xl font-medium text-center'>NANVIGATOR</p>
                    <SearchBar />
                    {children}
                </div>
            </body>
        </html>
    )
}
