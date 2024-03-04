import { CustomBlock } from "@/constants/Types"
import FormatLink from "../FormatLink"

import { tools } from "nanocurrency-web"
import AddressAlias from "../address/AddressAlias"
import { SkeletonText27rem, SkeletonText40rem } from "../skeletons/SkeletonText"

export default function BlockHalf(props: { block: CustomBlock }) {
    const amount = props.block.amount !== undefined ? <span className='font-mono'>&nbsp;Ӿ{parseFloat(tools.convert(props.block.amount, 'RAW', 'NANO')).toFixed(6)}</span> : null
    if (props.block.hash !== undefined) {
        const date = new Date(parseInt(props.block.timestamp))
        return (
            <div className="flex flex-col min-w-0">
                {props.block.type === "send" ?
                    <p className="max-h-[1.5rem] text-rose-600 truncate">SEND{amount}</p> : props.block.type === "receive" ?
                        <p className="max-h-[1.5rem] text-emerald-600 truncate">RECEIVE{amount}</p> : <p className='text-sky-700 truncate'>CHANGE</p>}
                <AddressAlias nanoAddress={props.block.account} alias={props.block.alias} />
                <FormatLink path={props.block.hash} type="block" />
                <p className="truncate">{date.toString()}</p>
            </div>
        )
    } else {
        // really bad
        return (
            <div className="flex flex-col w-[40.625rem] min-w-0">
                <p className="max-h-[1.5rem] text-emerald-600">RECEIVEABLE {amount}</p>
                <AddressAlias nanoAddress={props.block.account} alias={props.block.alias} />
                <SkeletonText40rem />
                <SkeletonText27rem />
            </div>
        )
    }
}