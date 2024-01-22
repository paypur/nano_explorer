import AddressCard from '@/components/address/AddressCard'
import RepresentativeCard from '@/components/representative/RepresentativeCard'
import BlockManager from '@/components/BlockManager'
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
        // div required for margin collapsing
        // https://www.joshwcomeau.com/css/rules-of-margin-collapse/
        <div>
            <AddressCard nanoAddress={nanoAddress} />
            {/* @ts-expect-error Server Component */}
            <RepresentativeCard nanoAddress={nanoAddress} />
            <BlockManager nanoAddress={nanoAddress} subscription={subscription} />
        </div>
    )
}