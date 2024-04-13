import { getConfirmationQuorum, getAccountWeight, getRepresentativesOnlineByAddress } from "@/serverFunctions/RPCs"
import RepresentativeHealth from "./RepresentativeHealth"
import RepresentativeType from "./RepresentativeType"

export default async function RepresentativeStatus(props: { nanoAddress: string }) {
    const isOnline = ((await getRepresentativesOnlineByAddress(props.nanoAddress))[0] === props.nanoAddress)

    const votingWeight = await getAccountWeight(props.nanoAddress)
    const onlineStakeTotal = await getConfirmationQuorum()
    const precentVotingWeight = votingWeight / onlineStakeTotal
    
    return (
        <div className="flex flex-row space-x-2 py-[1px]">
            {/* @ts-expect-error Server Component */}
            <RepresentativeType nanoAddress={props.nanoAddress}/>
            {/* @ts-expect-error Server Component */}
            <RepresentativeHealth nanoAddress={props.nanoAddress}/>
        </div>
    )
}