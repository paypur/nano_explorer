import { getAccountReceivable, getBlockInfo } from "@/functions/RPCs"
import { getNanoUSD } from "@/functions/ServerFunctions"
import { tools } from "nanocurrency-web"

export default async function AddressReceivableBalance(props: {nanoAddress: string}) {

    const recieveableArray = await getAccountReceivable(props.nanoAddress)
    
    let receiveableRaw = 0
    for (const hash of recieveableArray) {
        const block = await getBlockInfo(hash)
        receiveableRaw += parseInt(block.amount)
    }

    const receiveableNano = parseFloat(tools.convert(receiveableRaw.toString(), 'RAW', 'NANO'))
    const receiveableUSD = receiveableNano * parseFloat(await getNanoUSD())

    return (
        <div className='flex-row'>
            <p className='text-emerald-600 font-mono font-medium truncate'>Ӿ{receiveableNano.toFixed(6)}</p>
            <p className='text-emerald-600 font-mono truncate'>${receiveableUSD.toFixed(2)}</p>
        </div>
    )
}