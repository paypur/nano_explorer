"use client"

import { NODE_ADDRESS } from "@/constants/Constants"

import isValid from 'nano-address-validator'

import { FaServer } from "react-icons/fa"
import { MdOutlineHome } from "react-icons/md"
import { GrCluster } from "react-icons/gr"

import { useRouter } from "next/navigation"
import {useState} from "react";
import {getAutoComplete} from "@/server_functions/ServerFunctions";
import {AliasedAddress} from "@/constants/Types";

export default function SearchBar() {

    const router = useRouter()

    // https://react.dev/learn/separating-events-from-effects
    const [searchSelected, setSearchSelected] = useState(false)
    const [autoComplete, setAutoComplete] = useState<[AliasedAddress]|[]>([])

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
                // could use regex
                // could debounce, probably not though
                if (trimmed.length > 0 && trimmed !== "nano_") {
                    let response = await getAutoComplete(term)
                    setAutoComplete(response)
                } else {
                    setAutoComplete([])
                }
        }
    }

    return (
        <div className="flex flex-row mb-4 max-w-fit bg-white/25 backdrop-blur-sm rounded-md z-10">
            <button
                className='py-1 px-4 flex-none hover:bg-white/30 transition-colors rounded-md'
                onClick={() => router.push("/")}
                title="Home"
            >
                <MdOutlineHome size="1rem" />
            </button>
            <button
                className='py-1 px-4 flex-none hover:bg-white/30 transition-colors rounded-md'
                onClick={() => router.push("/node")}
                title="Node"
            >
                <FaServer size="1rem" />
            </button>
            <button
                className='py-1 px-4 flex-none hover:bg-white/30 transition-colors rounded-md'
                onClick={() => router.push("/representatives")}
                title="Representatives">
                <GrCluster size="1rem" />
            </button>
            <div
                className={'w-[43.75rem]'}
            >
                <input
                    id={"search"}
                    type={"search"}
                    autoComplete={"off"}
                    title={"Enter a valid Nano address (prefix not required) or Block hash"}
                    placeholder={NODE_ADDRESS}
                    maxLength={65}
                    onChange={(e) => search(e.target.value)}
                    onFocus={() => {
                        if (!searchSelected) {
                            setSearchSelected(true)
                        }
                    }}
                    onBlur={(e) => {
                        if (searchSelected) {
                            setTimeout(() => {
                                setSearchSelected(false)
                            }, 1000);
                        }
                    }}
                    className='flex-initial py-1 px-4 w-full bg-transparent font-mono font-light placeholder:text-gray-400 truncate hover:bg-white/30 transition-colors rounded-md'
                />
                {searchSelected && autoComplete.length > 0
                    // TODO: blur doesnt work
                    ? <div className={'absolute flex flex-col w-[43.75rem] backdrop-blur-sm bg-white/25 z-10'}>
                        {autoComplete.map((aa: AliasedAddress, i) => (
                            <button key={i} className='py-1 px-4 hover:bg-white/30 font-mono font-light' onClick={() => {
                                router.push(`/address/${aa.address}`)}} >
                                {aa.aliased ? aa.name : aa.address}
                            </button>
                        ))}
                    </div>
                    : <></>}
            </div>
        </div>
    )
}