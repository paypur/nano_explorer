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
        <div className='w-[54rem] min-w-0 flex divide-x rounded border border-sky-700'>
            <button
                className='py-2 px-4 flex-none border-sky-700'
                onClick={home}
            >
                <MdOutlineHome size="1.25rem" />
            </button>
            <input
                className='flex-auto py-2 px-4 bg-black border-sky-700 font-mono placeholder:text-gray-400 truncate'
                placeholder="nano_15zntj4a8r6bkihei788ciy1jgc5wnskan1gpgn8e8jku3r4qhr7rwifitir"
                title="enter a valid nano address or block hash"
                autoComplete="on"
                maxLength={65}
                onChange={(e) => setInput(e.target.value)} />
            <button
                className='py-2 px-4 flex-none border-sky-700'
                type="button"
                onClick={search}
            >
                Search
            </button>
        </div>
    )
}