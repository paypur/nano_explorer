import { getAlias } from "@/functions/ServerFunctions"
import FormatLink from "../FormatLink"

export default async function AddressAlias(props: { nanoAddress: string }) {

    const alias = await getAlias(props.nanoAddress)

    return ( 
        <>
            <p className={`font-medium text-white truncate ${alias !== null ? null : "italic"}`}>{alias !== null ? alias: "No Alias"}</p>
            <FormatLink path={props.nanoAddress} type="address"/>
        </>
    )
    
}