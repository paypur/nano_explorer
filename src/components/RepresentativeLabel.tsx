import { getConfirmationQuorum, getAccountWeight, getRepresentativesOnline, getRepresentatives } from "@/functions/RPCs"
import { tools } from "nanocurrency-web"
import FormatLink from "./FormatLink"

export default async function RepresentativeLabel(props: { nanoAddress: string }) {
    const reps: any[] = await getRepresentatives(props.nanoAddress)
    if (reps.hasOwnProperty(props.nanoAddress)) {
        const votingWeight = await getAccountWeight(props.nanoAddress)
        const onlineStakeTotal = await getConfirmationQuorum(props.nanoAddress)
        const precentVotingWeight = votingWeight / onlineStakeTotal
        const isOnline = ((await getRepresentativesOnline(props.nanoAddress))[0] === props.nanoAddress)
        return (
            <>
                <div className="flex flex-row space-x-2">
                    <div className={`py-1 px-2 my-1 w-fit rounded ${isOnline ? "bg-emerald-600" : "bg-rose-600"}`}>
                        <p className="text-sm">
                            {isOnline ? "Online" : "Offline"}
                        </p>
                    </div>
                    <div className={`py-1 px-2 my-1 w-fit rounded ${precentVotingWeight > 0.001 ? "bg-fuchsia-900" : "bg-fuchsia-600"}`}>
                        <p className="text-sm">
                            {precentVotingWeight > 0.001 ? "Principal Representative" : "Representative"}
                            <span className="font-mono text-sm text-slate-50">
                                &nbsp;(Ӿ{parseFloat(tools.convert(votingWeight, 'RAW', 'NANO')).toFixed(6)} | {(precentVotingWeight * 100).toFixed(2)}%)
                            </span>
                        </p>
                    </div>
                </div>
                <FormatLink path={props.nanoAddress} type="address" />
            </>
        )
    } else {
        return null
    }
}