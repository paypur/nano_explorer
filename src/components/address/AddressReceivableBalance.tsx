import { getAccountReceivable, getBlockInfo } from "@/functions/RPCs"
import { tools } from "nanocurrency-web"

export default async function AddressReceivableBalance(props: {nanoAddress: string}) {

    let recieveableBalance = 0

    const recieveableArray = await getAccountReceivable(props.nanoAddress)

    for (const hash of recieveableArray) {
        const block = await getBlockInfo(hash)
        recieveableBalance += parseInt(block.amount)
    }

    return (
        <p className='font-mono medium text-emerald-600 truncate'>Ӿ{parseFloat(tools.convert(recieveableBalance.toString(), 'RAW', 'NANO')).toFixed(6)}</p>
    )
}