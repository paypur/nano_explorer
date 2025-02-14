"use client"

import { NODE_ADDRESS } from "@/constants/Constants"

import isValid from 'nano-address-validator'

import { FaServer } from "react-icons/fa"
import { MdOutlineHome } from "react-icons/md"
import { GrCluster } from "react-icons/gr"

import { useRouter } from "next/navigation"
import {useState} from "react";
import {getAutoComplete} from "@/serverFunctions/ServerFunctions";

export default function SearchBar() {

    const router = useRouter()

    const [autoComplete, setAutoComplete] = useState<[string]>([])

    async function search(term: string) {
        const trimmed = term.trim()
        switch (trimmed.length) {
            case 64:
                if (trimmed.slice(0, 4) !== "nano") {
                    router.push(`/block/${trimmed}`)
                }
                break
            case 65:
                if (isValid(trimmed)) {
                    router.push(`/address/${trimmed}`)
                }
                break
            default:
                if (trimmed !== "nano_") {
                    // setSearching(true)
                    let response = await getAutoComplete(term)
                    // https://www.geeksforgeeks.org/create-dropdowns-ui-with-next-js-and-tailwind-css/
                    if (response !== undefined) {
                        setAutoComplete(response)
                    } else {
                        setAutoComplete([])
                    }
                    break
                }
        }
    }

    return (
        <>
            <div className="flex flex-row bg-white/25 backdrop-blur-sm shadow-lg rounded-md z-10">
                <button
                    className='py-2 px-4 flex-none hover:bg-white/30 transition-colors rounded-md'
                    onClick={() => router.push("/")}
                    title="Home"
                >
                    <MdOutlineHome size="1.25rem" />
                </button>
                <button
                    className='py-2 px-4 flex-none hover:bg-white/30 transition-colors rounded-md'
                    onClick={() => router.push("/node")}
                    title="Node"
                >
                    <FaServer size="1.25rem" />
                </button>
                <button
                    className='py-2 px-4 flex-none hover:bg-white/30 transition-colors rounded-md'
                    onClick={() => router.push("/representatives")}
                    title="Representatives">
                    <GrCluster className="invert" size="1.25rem" />
                </button>
                <input
                    className='flex-initial w-[42.75rem] py-2 px-4 bg-transparent font-mono placeholder:text-gray-400 truncate hover:bg-white/30 transition-colors rounded-md'
                    placeholder={NODE_ADDRESS}
                    title="Enter a valid Nano address or block hash"
                    maxLength={65}
                    onChange={(e) => search(e.target.value)}
                />
            </div>
            {autoComplete.length !== 0 ? <div>
                {autoComplete.map((str: String) => (<p>{str}</p>)) }
            </div> : <></>}
        </>
    )
}