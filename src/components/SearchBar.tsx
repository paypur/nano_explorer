"use client"

import { NODE_ADDRESS } from "@/constants/Constants"

import isValid from 'nano-address-validator'

import { FaServer } from "react-icons/fa"
import { MdOutlineHome } from "react-icons/md"
import { GrCluster } from "react-icons/gr"

import { useRouter } from "next/navigation"

export default function SearchBar() {

    const router = useRouter()

    function search(term: string) {
        const trimmed = term.trim()
        switch (trimmed.length) {
            case 64:
                if (trimmed.slice(0, 4) !== "nano") { router.push(`/block/${trimmed}`) }
                break
            case 65:
                if (isValid(trimmed)) { router.push(`/address/${trimmed}`) }
                break
        }
    }

    return (
        <div className="justify-center flex flex-row">
            <button
                className='py-2 px-4 flex-none'
                onClick={() => router.push("/")}
                title="Home"
            >
                <MdOutlineHome size="1.25rem" />
            </button>
            <button
                className='py-2 px-4 flex-none'
                onClick={() => router.push("/node")}
                title="Node"
            >
                <FaServer size="1.25rem" />
            </button>
            <button
                className='py-2 px-4 flex-none invert'
                onClick={() => router.push("/representatives")}
                title="Representatives">
                <GrCluster size="1.25rem" />
            </button>
            <input
                className='flex-initial w-[42.75rem] py-2 px-4 bg-black font-mono placeholder:text-gray-400 truncate'
                placeholder={NODE_ADDRESS}
                title="Enter a valid Nano address or block hash"
                maxLength={65}
                onChange={(e) => search(e.target.value)}
            />
        </div>
    )
}