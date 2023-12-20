import AddressCard from '@/components/address/AddressCard'
import BlockInfo from '@/components/BlockInfo'
import { headers } from 'next/headers'

export default function AddressPage() {

    // https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664
    const headersList = headers()
    // read the custom x-url header
    const header_url = headersList.get('x-url') || ""

    const nanoAddress = header_url.slice(-65)

    const subscription = {
        "action": "subscribe",
        "topic": "confirmation",
        "options": {
            "accounts": [nanoAddress]
        }
    }

    return (
        <>
            {/* @ts-expect-error Server Component */}
            <AddressCard nanoAddress={nanoAddress} />
            <BlockInfo nanoAddress={nanoAddress} subscription={subscription}/>
        </>
    )
}