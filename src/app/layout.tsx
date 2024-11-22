import '@/styles/globals.css'
import SearchBar from '@/components/SearchBar'
import NANVIGATOR from '../app/logo_large.png'

import { Roboto, Roboto_Mono } from "next/font/google"
import Image from 'next/image'


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
        <html lang="en" className={`${roboto.variable} ${roboto_mono.variable} dark`}>
            <body className='flex justify-center bg-black font-sans font-normal text-base text-gray-100 antialiased min-w-0 mx-16'>
                <div className='flex flex-col'>
                    <div className='flex flex-col sticky top-0 self-center min-w-0'>
                        <Image className='self-center mt-8 mb-4 min-w-[245px] min-h-[30px] shadow-lg' src={NANVIGATOR} alt="Nanvigator" priority={true} />
                        <SearchBar />
                    </div>
                    {children}
                </div>
            </body>
        </html>
    )
}
