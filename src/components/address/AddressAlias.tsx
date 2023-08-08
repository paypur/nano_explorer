"use client"

import { useEffect, useState } from "react"
import { getAlias } from "@/functions/ServerFunctions"
import FormatLink from "../FormatLink"
import SkeletonText from "../skeletons/SkeletonText"

export default function AddressAlias(props: { nanoAddress: string }) {
    
    const [alias, setAlias] = useState("")
    
    useEffect(() => {
        const func = async () => {
            const data = await getAlias(props.nanoAddress)
            setAlias((data.names.length !== 0) ? data.names[0]["name"] : null)
        }
        func()
    },[])

    return ( 
        <>
            {alias !== "" 
            ? <p className={`font-medium text-white truncate ${alias === null ? "italic" : null}`}>{alias === null ? "No Alias" : alias}</p>
            : <SkeletonText/>}
            <FormatLink path={props.nanoAddress} type="address"/>
        </>
    )
}