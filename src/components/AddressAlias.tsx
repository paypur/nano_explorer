"use client"

import { useEffect, useState } from "react"
import FormatLink from "./FormatLink"
import { getAlias } from "@/functions/ServerFunctions"

export default function AddressAlias(props: { nanoAddress: string }) {
    
    const [alias, setAlias] = useState()
    
    useEffect(() => {
        const func = async () => {
            const data = await getAlias(props.nanoAddress)
            setAlias((data.names.length !== 0) ? data.names[0]["name"] : null)
        }
        func()
    },[])

    return ( 
        <>
            <p className='font-medium text-white truncate'>{alias}</p>
            <FormatLink path={props.nanoAddress} type="address"/>
        </>
    )
}