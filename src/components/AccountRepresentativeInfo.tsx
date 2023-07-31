import { getAccountRepresentative } from "@/functions/RPCs"
import AddressAlias from "./AddressAlias"
import RepresentativeStatus from "./RepresentativeStatus"

export default async function AccountRepresentativeInfo(props: { nanoAddress: string }) {
    const repAddress = await getAccountRepresentative(props.nanoAddress)
    return (
        <>
            {/* @ts-expect-error Server Component */}
            <RepresentativeStatus nanoAddress={repAddress} />
            {/* @ts-expect-error Server Component */}
            <AddressAlias nanoAddress={repAddress} />
        </>
    )
}