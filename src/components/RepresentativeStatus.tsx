import { getConfirmationQuorum, getAccountWeight, getRepresentativesOnline } from "@/functions/RPCs"

export default async function RepresentativeStatus(props: { nanoAddress: string }) {
    const isOnline = ((await getRepresentativesOnline(props.nanoAddress))[0] === props.nanoAddress)

    const votingWeight = await getAccountWeight(props.nanoAddress)
    const onlineStakeTotal = await getConfirmationQuorum()
    const precentVotingWeight = votingWeight / onlineStakeTotal
    
    return (
        <div className="flex flex-row space-x-2 pt-1 ml-[0.0625rem] w-fit">
            <div className={`py-0.5 px-1.5 w-fit rounded ${isOnline ? "bg-emerald-600" : "bg-rose-600"}`}>
                <p className="text-sm">{isOnline ? "Online" : "Offline"}</p>
            </div>
            <div className={`py-0.5 px-1.5 w-fit rounded ${precentVotingWeight > 0.001 ? "bg-violet-900" : "bg-sky-600"}`}>
                <p className="text-sm">
                    {precentVotingWeight > 0.001 ? "Principal Representative" : "Representative"}
                </p>
            </div>
        </div>
    )
}