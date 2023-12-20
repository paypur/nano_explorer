import { getConfirmationQuorum, getAccountWeight, getRepresentativesOnline } from "@/functions/RPCs"

export default async function RepresentativeStatus(props: { nanoAddress: string }) {
    const isOnline = ((await getRepresentativesOnline(props.nanoAddress))[0] === props.nanoAddress)

    const votingWeight = await getAccountWeight(props.nanoAddress)
    const onlineStakeTotal = await getConfirmationQuorum()
    const precentVotingWeight = votingWeight / onlineStakeTotal
    
    return (
        <div className="flex flex-row space-x-2 py-[1px] ml-[0.25]">
            <div className={`py-0.5 px-1.5 w-fit rounded border ${precentVotingWeight > 0.001 ? "border-violet-700" : "border-sky-700"}`}>
                <p className="text-xs text-gray-400 truncate">{precentVotingWeight > 0.001 ? "Principal Representative" : "Representative"}</p>
            </div>
            <div className={`py-0.5 px-1.5 w-fit rounded border ${isOnline ? "border-emerald-600" : "border-rose-600"}`}>
                <p className="text-xs text-gray-400 truncate">{isOnline ? "Online" : "Offline"}</p>
            </div>
        </div>
    )
}