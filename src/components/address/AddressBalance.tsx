import { getAccountBalance } from "@/functions/RPCs"
import { getNanoUSD } from "@/functions/ServerFunctions"
import { tools } from "nanocurrency-web"

export default async function AddressBalance (props: { nanoAddress: string }) {
    const balanceRaw = await getAccountBalance(props.nanoAddress)
    const balanceUSD = (parseFloat(tools.convert(balanceRaw, 'RAW', 'NANO')) * parseFloat(await getNanoUSD()))
    return (
        <div className='flex-row self-end'>
            <p className='font-mono font-medium text-white truncate'>Ӿ{parseFloat(tools.convert(balanceRaw, 'RAW', 'NANO')).toFixed(6)}</p>
            <p className='font-mono truncate'>${balanceUSD.toFixed(2)}</p>
        </div>
    )
}