import { getConfirmationQuorum, getAccountWeight } from "@/serverFunctions/RPCs"

export default async function RepresentativeType(props: { nanoAddress: string }) {
    const votingWeight = await getAccountWeight(props.nanoAddress)
    const onlineStakeTotal = await getConfirmationQuorum()
    const precentVotingWeight = votingWeight / onlineStakeTotal
    
    return (
        <div className={`py-0.5 px-1.5 w-fit rounded border ${precentVotingWeight > 0.001 ? "border-violet-700" : "border-sky-700"}`}>
            <p className="text-xs text-gray-400 truncate">{precentVotingWeight > 0.001 ? "Principal Representative" : "Representative"}</p>
        </div>
    )
}