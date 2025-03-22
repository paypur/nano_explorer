import { getRepresentativesOnlineByAddress } from "@/server_functions/RPCs"

export default async function RepresentativeHealth(props: { nanoAddress: string }) {
    const isOnline = ((await getRepresentativesOnlineByAddress(props.nanoAddress))[0] === props.nanoAddress)

    return (
        <div className={`py-0.5 px-1.5 w-fit h-fit rounded border ${isOnline ? "border-emerald-600" : "border-rose-600"}`}>
            <p className="text-xs text-neutral-400 truncate">{isOnline ? "Online" : "Offline"}</p>
        </div>
    )
}