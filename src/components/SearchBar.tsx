"use client"

import { useState } from "react"

import { MdOutlineHome } from "react-icons/md";

export default function SearchBar() {
    
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
        <div className='flex my-6 border divide-x rounded border-sky-700'>
            <button
                className='py-2 px-4 flex-none border-sky-700'
                onClick={() => {window.location = "/"}}> 
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

