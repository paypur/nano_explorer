import AddressAlias from "./AddressAlias";
import { getAlias } from "@/functions/ServerFunctions";

export default async function AddressAliasAsync(props: { nanoAddress: string }) {

    const alias = await getAlias(props.nanoAddress)
    return (
        <AddressAlias nanoAddress={props.nanoAddress} alias={alias} />
    )
    
}