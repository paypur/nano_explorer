"use client"

import { getAlias } from "@/functions/ServerFunctions"
import FormatLink from "../FormatLink"
import SkeletonText from "../skeletons/SkeletonText"

import { useState } from "react"
import { useAsyncEffect } from "use-async-effect"

export default function AddressAlias(props: { nanoAddress: string }) {
    
    const [alias, setAlias] = useState<string|null>("")
    
    useAsyncEffect(async () => {
        const data = await getAlias(props.nanoAddress)
        setAlias(data)
    }, [])

    return ( 
        <>
            {alias !== "" 
            ? <p className={`text-white truncate ${alias !== null ? "font-medium" : "font-light"}`}>{alias !== null ? alias : "No Alias"}</p>
            : <SkeletonText/>}
            <FormatLink path={props.nanoAddress} type="address"/>
        </>
    )
}