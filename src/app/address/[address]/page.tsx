import AddressCard from '@/components/AddressCard'
import BlockInfo from '@/components/BlockInfo'
import { getAccountBalance, getAccountRepresentative } from '@/functions/RPCs'
import { headers } from 'next/headers'

export default async function AddressPage() {

    // https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664
    const headersList = headers()
    // read the custom x-url header
    const header_url = headersList.get('x-url') || ""

    const nanoAddress = header_url.slice(-65)

    const balance = await getAccountBalance(nanoAddress)
    const representative = await getAccountRepresentative(nanoAddress)

    const subscription = {
        "action": "subscribe",
        "topic": "confirmation",
        "options": {
            "accounts": [nanoAddress]
        }
    }

    return (
        <div className='w-full min-w-0'>
            <AddressCard nanoAddress={nanoAddress} balance={balance} representative={representative} />
            <BlockInfo nanoAddress={nanoAddress} MAX_BLOCKS={Number.MAX_SAFE_INTEGER} subscription={subscription}/>
        </div>
    )
}