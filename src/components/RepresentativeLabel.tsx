import { getAccountVWeight, getDelegatorsCount, isPrincipalRepresentative, isRepresentative } from "@/functions/RPCs"
import { tools } from "nanocurrency-web"

export default async function RepresentativeLabel(props: { nanoAddress: string }) {
    if (await isRepresentative(props.nanoAddress)) {
        const votingWeight = await getAccountVWeight(props.nanoAddress)
        //const delegatorsCount = await getDelegatorsCount(props.nanoAddress)
        return (
            <div className="py-2 px-4 border rounded border-sky-700">
                <p className="font-normal">{await isPrincipalRepresentative(props.nanoAddress, votingWeight) ? "Principal Representative" : "Representative"}
                    <span className="font-mono text-lg text-slate-50">&nbsp;( Ӿ{parseFloat(tools.convert(votingWeight, 'RAW', 'NANO')).toFixed(6)} | `delegatorsCount` )</span>
                </p>
                <p className='font-sans text-sm text-slate-200'>Voting Weight<span className="font-mono text-lg text-slate-50">&nbsp;Ӿ{parseFloat(tools.convert(votingWeight, 'RAW', 'NANO')).toFixed(6)}</span></p>
                <p className='font-sans text-sm text-slate-200'>Delegators<span className="font-mono text-lg text-slate-50">&nbsp;PLACEHOLDER</span></p>
            </div>
        )
    } else {
        return null
    }
}