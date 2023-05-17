import AddressCard from '@/components/address/[address]/AddressCard'
import RepresentativeLabel from '@/components/address/[address]/RepresentativeLabel'
import TransactionsCard from '@/components/address/[address]/TransactionsCards'
import { headers } from 'next/headers'

export default async function AddressPage() {

    // https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664
    const headersList = headers()
    // read the custom x-url header
    const header_url = headersList.get('x-url') || ""

    const nanoAddress = header_url.slice(-65)

    return (
        <div>
            <AddressCard nanoAddress={nanoAddress}></AddressCard>
            <RepresentativeLabel nanoAddress={nanoAddress}></RepresentativeLabel>
            <TransactionsCard nanoAddress={nanoAddress}></TransactionsCard>
        </div>
    )
}
