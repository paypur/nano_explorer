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
        <html lang="en" className={`${roboto.variable} ${roboto_mono.variable}`}>
            <body className='flex justify-center bg-black font-sans font-normal text-base text-gray-100 antialiased'>
                <div className='min-w-0 mx-16'>
                    <div className='flex flex-col w-full'>
                        <Image className='self-center my-8 min-w-[245px] min-h-[20px]' src={NANVIGATOR} alt="Nanvigator" priority={true}/>
                        <SearchBar />
                        {children}
                    </div>
                </div>
            </body>
        </html>
    )
}
