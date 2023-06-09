import { getAccountVWeight, getDelegatorsCount, isPrincipalRepresentative, isRepresentative } from "@/functions/RPCs"
import { tools } from "nanocurrency-web"

export default async function RepresentativeLabel(props: {nanoAddress: string}) {
    if (await isRepresentative(props.nanoAddress)) {
        const votingWeight = await getAccountVWeight(props.nanoAddress)
        //const delegatorsCount = await getDelegatorsCount(props.nanoAddress)
        return (
            <div className="py-2 px-4 border rounded border-sky-700">
                <p className="font-normal">{await isPrincipalRepresentative(props.nanoAddress, votingWeight) ? "Principal Representative": "Representative"}</p>
                <div className="flex flex-row">
                    <p>Voting Weight:&nbsp;</p><p className="font-mono">Ӿ{parseFloat(tools.convert(votingWeight, 'RAW', 'NANO')).toFixed(6)}</p>
                </div>
                <div className="flex flex-row">
                    <p className="text-white">Delegators:&nbsp;</p><p className="font-mono">PLACEHOLDER</p>
                </div>
            </div>
        )
    } else {
        return null
    }
}