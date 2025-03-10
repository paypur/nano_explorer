import { CustomBlock } from "@/constants/Types"
import FormatLink from "../FormatLink"

import { tools } from "nanocurrency-web"
import AddressAlias from "../address/AddressAlias"

export default function BlockHalf(props: { block: CustomBlock }) {
    const amount = props.block.amount !== undefined ? <span className='font-mono'>&nbsp;Ӿ{parseFloat(tools.convert(props.block.amount, 'RAW', 'NANO')).toFixed(6)}</span> : null
    if (props.block.hash !== undefined) {
        const date = new Date(parseInt(props.block.timestamp))
        return (
            <div className="flex flex-col min-w-0">
                {props.block.type === "send" ?
                    <p className="font-medium max-h-[1.5rem] text-rose-600 truncate">SEND{amount}</p> : props.block.type === "receive" ?
                        <p className="font-medium max-h-[1.5rem] text-emerald-600 truncate">RECEIVE{amount}</p> : <p className='font-medium text-sky-700 truncate'>CHANGE</p>}
                <AddressAlias nanoAddress={props.block.account} alias={props.block.alias} />
                <FormatLink path={props.block.hash} type="block" />
                <p className="font-light truncate">{date.toString()}</p>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col min-w-0">
                <p className="font-medium max-h-[1.5rem] text-emerald-600">RECEIVABLE {amount}</p>
                <AddressAlias nanoAddress={props.block.account} alias={props.block.alias} />
                <div className={"h-full mt-1 flex outline-dashed rounded-lg outline-2 outline-neutral-500"}>
                    <p className={"text-neutral-400 font-light my-auto mx-auto"}>waiting for address to receive transaction</p>
                </div>
            </div>
        )
    }
}