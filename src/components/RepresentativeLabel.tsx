import { getConfirmationQuorum , getAccountVWeight, isRepresentative } from "@/functions/RPCs"
import { tools } from "nanocurrency-web"

export default async function RepresentativeLabel(props: { nanoAddress: string }) {
    if (await isRepresentative(props.nanoAddress)) {
        const votingWeight = await getAccountVWeight(props.nanoAddress)
        const onlineStakeTotal = await getConfirmationQuorum(props.nanoAddress)
        const precentVotingWeight = votingWeight / onlineStakeTotal
        return (
            <div className={`py-1 px-2 my-1 w-fit rounded ${precentVotingWeight > 0.001  ? "bg-fuchsia-900" : "bg-fuchsia-600"}`}>
                <p className="font-normal text-sm">{precentVotingWeight > 0.001  ? "Principal Representative" : "Representative"}
                    <span className="font-mono text-sm text-slate-50">
                        &nbsp;(Ӿ{parseFloat(tools.convert(votingWeight, 'RAW', 'NANO')).toFixed(6)} | {(precentVotingWeight * 100).toFixed(2)}%)
                        </span>
                </p>
            </div>
        )
    } else {
        return null
    }
}