import { getAccountWeight, getConfirmationQuorum } from "@/server_functions/RPCs"
import { tools } from "nanocurrency-web"

export default async function RepresentativeWeight (props: { nanoAddress: string }) {
    if ((await getAccountWeight(props.nanoAddress)) !== "0") {
        const votingWeight = await getAccountWeight(props.nanoAddress)
        const onlineStakeTotal = await getConfirmationQuorum()
        const precentVotingWeight = votingWeight / onlineStakeTotal
        return (
            <>
                <p className='font-mono font-medium text-white truncate'>Ӿ{parseFloat(tools.convert(votingWeight, 'RAW', 'NANO')).toFixed(6)}</p>
                <p className='max-h-[1.5rem] truncate'><span className='font-mono'>{(precentVotingWeight * 100).toFixed(2)}%&nbsp;</span>of online voting weight</p>
            </>
        )
    }
}