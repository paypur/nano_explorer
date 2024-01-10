import { getAccountWeight, getConfirmationQuorum } from "@/functions/RPCs"
import { tools } from "nanocurrency-web"

export default async function AddressWeight (props: { nanoAddress: string }) {
    const votingWeight = await getAccountWeight(props.nanoAddress)
    const onlineStakeTotal = await getConfirmationQuorum()
    const precentVotingWeight = votingWeight / onlineStakeTotal
    return (
        <div>
            <p className='text-gray-400'>Voting Weight</p>
            <p className='font-mono font-medium text-white truncate'>Ӿ{parseFloat(tools.convert(votingWeight, 'RAW', 'NANO')).toFixed(6)}</p>
            <p className='max-h-[1.5rem] truncate'><span className='font-mono'>{(precentVotingWeight * 100).toFixed(2)}%&nbsp;</span>of online voting weight</p>
        </div>
    )
}