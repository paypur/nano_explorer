import { getAlias } from "@/functions/ServerFunctions";
import AddressAlias from "./AddressAlias";

export default async function AddressAliasAsync(props: { nanoAddress: string }) {
    const alias = await getAlias(props.nanoAddress)
    return ( 
        <AddressAlias nanoAddress={props.nanoAddress} alias={alias}/>
    )
}