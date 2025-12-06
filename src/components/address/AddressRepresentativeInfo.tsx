import AddressAliasAsync from "./AddressAliasAsync"
import RepresentativeStatus from "../representative/RepresentativeStatus"
import { getAccountRepresentative } from "@/server_functions/RPCs"

export default async function AccountRepresentativeInfo(props: { nanoAddress: string }) {
    const repAddress = await getAccountRepresentative(props.nanoAddress)
    return (
        <>
            <RepresentativeStatus nanoAddress={repAddress} />
            <AddressAliasAsync nanoAddress={repAddress} />
        </>
    )
}