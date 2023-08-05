import { CustomBlock } from "@/constants/Types"
import FormatLink from "./FormatLink"
import SkeletonTextWide from "./SkeletonTextWide"
import AddressAlias from "./address/AddressAlias"

import { tools } from "nanocurrency-web"

export default function BlockHalf (props: { block: CustomBlock }) {
    if (props.block.hash !== undefined) {
        const amount = props.block.amount !== undefined ? <span className='font-mono'>&nbsp;Ӿ{parseFloat(tools.convert(props.block.amount, 'RAW', 'NANO')).toFixed(6)}</span> : null
        const date = new Date(parseInt(props.block.timestamp))
        return (
            <div className="flex flex-col min-w-0">
                {props.block.type === "send" ? 
                    <p className="max-h-[1.5rem] text-rose-600">SEND{amount}</p> : props.block.type === "receive" ?
                        <p className="max-h-[1.5rem] text-emerald-600">RECEIVE{amount}</p> : <p className='text-sky-700'>CHANGE</p>}
                <AddressAlias nanoAddress={props.block.account} />
                <FormatLink path={props.block.hash} type="block" />
                <p className="truncate">{date.toString()}</p>
            </div>
        )
    } else {
        // really bad
        return (
            <div className="flex flex-col w-[44.688rem] min-w-0">
                <p className="text-emerald-600">RECEIVEABLE</p>
                <AddressAlias nanoAddress={props.block.account} />
                <SkeletonTextWide/>
                <SkeletonTextWide/>
            </div>
        )
    }
}