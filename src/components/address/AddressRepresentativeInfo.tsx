import RepresentativeStatus from "../representative/RepresentativeStatus"
import { getAccountRepresentative } from "@/functions/RPCs"
import AddressAliasAsync from "./AddressAliasAsync"

export default async function AccountRepresentativeInfo(props: { nanoAddress: string }) {
    const repAddress = await getAccountRepresentative(props.nanoAddress)
    return (
        <>
            {/* @ts-expect-error Server Component */}
            <RepresentativeStatus nanoAddress={repAddress} />
            {/* @ts-expect-error Server Component */}
            <AddressAliasAsync nanoAddress={repAddress} />
        </>
    )
}