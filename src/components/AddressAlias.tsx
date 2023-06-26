"use client"

import { useEffect, useState } from "react"
import FormatLink from "./FormatLink"

export default function AddressAlias(props: { nanoAddress: string }) {
    
    const [alias, setAlias] = useState()
    
    useEffect(() => {
        const getAlias = async () => {
            const result = await fetch(`https://nano.to/.well-known/nano-currency.json?names=${props.nanoAddress}`)
            let data = await result.json()
            setAlias((data.names.length !== 0) ? data.names[0]["name"] : null)
        }
        getAlias()
    },[])

    return ( 
        <>
            <p className='font-medium text-white truncate'>{alias}</p>
            <FormatLink path={props.nanoAddress} type="address"/>
        </>
    )
}