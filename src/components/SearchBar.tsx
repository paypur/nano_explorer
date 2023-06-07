"use client"

import { useState } from "react"

import { MdOutlineHome } from "react-icons/md"

export default function SearchBar() {
    
    const [input, setInput] = useState("")
        
    const search = () => {
        if (input.length == 65) {
            https://github.com/microsoft/TypeScript/issues/48949#issuecomment-1203967132
            (window as Window).location = "/address/" + input
        } else if (input.length == 64) {
            (window as Window).location = "/block/" + input
        } else {
            console.log("Invalid input " + input)
        }
    }

    const home = () => {
        (window as Window).location = "/"
    }

    return (
        <div className='flex my-6 border divide-x rounded border-sky-700'>
            <button
                className='py-2 px-4 flex-none border-sky-700'
                onClick={home}> 
                <MdOutlineHome size="1.25rem"/>
            </button>
            <input
                className='py-2 px-4 flex-auto bg-black border-sky-700'
                placeholder="nano_15zntj4a8r6bkihei788ciy1jgc5wnskan1gpgn8e8jku3r4qhr7rwifitir"
                title="enter a valid nano address or block hash" 
                autoComplete="on" 
                maxLength={65}
                onChange={(e) => setInput(e.target.value)}>
            </input>
            <button 
                className='py-2 px-4 flex-none border-sky-700'
                type="button"
                onClick={search}>
                Search
            </button>    
        </div>
    )
}