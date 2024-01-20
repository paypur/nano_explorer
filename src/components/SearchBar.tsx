"use client"

import { useState } from "react"
import { MdOutlineHome } from "react-icons/md"
import { FaServer } from "react-icons/fa"
import { NODE_ADDRESS } from "@/constants/Constants"

export default function SearchBar() {

    const [input, setInput] = useState("")

    const search = () => { 
        if (input.length == 65) {
            https://github.com/microsoft/TypeScript/issues/48949#issuecomment-1203967132
            (window as Window).location = "/address/" + input
        } else if (input.length == 64) {
            (window as Window).location = "/block/" + input
        } else {
            console.error("Invalid input " + input)
        }
    }

    return (
        <div className="justify-center flex flex-row">
            <button
                className='py-2 px-4 flex-none'
                onClick={() => {(window as Window).location = "/"}}
                title="Home"
            >
                <MdOutlineHome size="1.25rem" />
            </button>
            <button
                className='py-2 px-4 flex-none'
                onClick={() => {(window as Window).location = "/node"}}
                title="Node"
            >
                <FaServer size="1.25rem" />
            </button>
            <input
                className='flex-initial w-[42rem] py-2 px-4 bg-black font-mono placeholder:text-gray-400 truncate'
                placeholder={NODE_ADDRESS}
                title="Enter a valid Nano address or block hash"
                autoComplete="on"
                maxLength={65}
                onChange={(e) => setInput(e.target.value)} />
            <button
                className='py-2 px-4 flex-none'
                type="button"
                onClick={search}
                title="Search"
            >
                Search
            </button>
        </div>
    )
}