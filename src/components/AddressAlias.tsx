"use client"

import { useEffect, useState } from "react"
import FormatLink from "./FormatLink"
import { getAlias } from "@/functions/ServerFunctions"
import SkeletonText from "./SkeletonText"

export default function AddressAlias(props: { nanoAddress: string }) {
    
    const [alias, setAlias] = useState("")
    
    useEffect(() => {
        const func = async () => {
            const data = await getAlias(props.nanoAddress)
            setAlias((data.names.length !== 0) ? data.names[0]["name"] : "no alias")
        }
        func()
    },[])

    return ( 
        <>
            {alias !== "" 
            ? <p className={`font-medium text-white truncate ${alias === "no alias" ? "italic" : null}`}>{alias}</p>
            : <SkeletonText/>}
            <FormatLink path={props.nanoAddress} type="address"/>
        </>
    )
}