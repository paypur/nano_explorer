import { getRepresentativesOnlineByAddress } from "@/serverFunctions/RPCs"

export default async function RepresentativeHealth(props: { nanoAddress: string }) {
    const isOnline = ((await getRepresentativesOnlineByAddress(props.nanoAddress))[0] === props.nanoAddress)

    return (
        <div className={`py-0.5 px-1.5 w-fit rounded border ${isOnline ? "border-emerald-600" : "border-rose-600"}`}>
            <p className="text-xs text-gray-400 truncate">{isOnline ? "Online" : "Offline"}</p>
        </div>
    )
}