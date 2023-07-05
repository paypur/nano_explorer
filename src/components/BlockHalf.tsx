import { CustomBlock } from "@/constants/Types"
import FormatLink from "./FormatLink"
import { tools } from "nanocurrency-web"
import AddressAlias from "./AddressAlias"

export default function BlockHalf (props: { block: CustomBlock }) {

    if (props.block !== undefined) {
        const amount = <span className='font-mono'>&nbsp;Ӿ{parseFloat(tools.convert(props.block.amount, 'RAW', 'NANO')).toFixed(6)}</span>
        const date = new Date(parseInt(props.block.timestamp))
        return (
            <div className="flex flex-col min-w-0">
                {props.block.type === "send" ? <p className="text-rose-600">SEND{amount}</p> : props.block.type === "receive" ? <p className="text-emerald-600">RECEIVE{amount}</p> : <p className='text-sky-700'>CHANGE</p>}
                <AddressAlias nanoAddress={props.block.account}/>
                <FormatLink path={props.block.hash} type="block" />
                <p className="truncate">{date.toString()}</p>
            </div>
        )
    } else {
        // really bad
        return (
            <div className="flex flex-col min-w-0">
                <p className="place-self-center">MISSING RECEIVE BLOCK</p>
            </div>
        )
    }

}