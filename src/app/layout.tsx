"use client"

import '@/styles/globals.css'

import { useState } from "react"
import { Roboto } from "next/font/google"

const roboto = Roboto({
    weight: ['300'],
    subsets: ['latin']
})

export default function RootLayout({children}: {children: React.ReactNode}) {
    
    const [input, setInput] = useState("");
    
    const search = () => {
        if (input.length == 65) {
            window.location = "/address/" + input
        } else if (input.length == 64) {
            window.location = "/block/" + input
        } else {
            console.log("Invalid input " + input)
        }
    }

    return (
        <html lang="en">
            <body className={roboto.className}>
                <div className='px-12'>
                    <p className='my-6 text-3xl text-center'>Nano Network Explorer</p>
                    <div className='my-6 border divide-x rounded border-sky-700'>
                        <input
                            className='py-2 px-4 w-11/12 bg-black'
                            placeholder="nano_15zntj4a8r6bkihei788ciy1jgc5wnskan1gpgn8e8jku3r4qhr7rwifitir"
                            title="enter a valid nano address or block hash" 
                            autoComplete="on" 
                            maxLength={65} 
                            onChange={(e) => setInput(e.target.value)} 
                            onSubmit={search}>
                        </input>
                        <button 
                            className='py-2 px-4 w-1/12 border-sky-700'
                            onClick={search}>
                            Search
                        </button>    
                    </div>
                    {children}
                </div>
            </body>
        </html>
    )
}
