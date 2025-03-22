import { getAccountBalance } from "@/server_functions/RPCs"
import { getNanoUSD } from "@/server_functions/ServerFunctions"
import { tools } from "nanocurrency-web"

export default async function AddressBalance (props: { nanoAddress: string }) {
    const balanceRaw = await getAccountBalance(props.nanoAddress)
    const balanceNano = parseFloat(tools.convert(balanceRaw, 'RAW', 'NANO'))
    const balanceUSD = balanceNano * parseFloat(await getNanoUSD())
    return (
        <div className='flex-row'>
            <p className='font-medium text-white font-mono truncate'>Ӿ{balanceNano.toFixed(6)}</p>
            <p className='font-mono truncate'>${balanceUSD.toFixed(2)}</p>
        </div>
    )
}