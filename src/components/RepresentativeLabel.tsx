import { getAccountVWeight, isPrincipalRepresentative, isRepresentative } from "@/functions/RPCs"
import { tools } from "nanocurrency-web"

export default async function RepresentativeLabel(props: {nanoAddress: string}) {
    if (await isRepresentative(props.nanoAddress)) {
        const votingWeight = await getAccountVWeight(props.nanoAddress)
        return (
            <div className="py-2 px-4 border rounded border-sky-700">
                <p className="">{await isPrincipalRepresentative(props.nanoAddress, votingWeight) ? "Principal Representative": "Representative"}</p>
                <p>Voting Weight:  Ӿ{parseFloat(tools.convert(votingWeight, 'RAW', 'NANO')).toFixed(6)}</p>
            </div>
        )
    } else {
        return null
    }
}