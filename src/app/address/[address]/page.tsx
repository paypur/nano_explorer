import AddressCard from '@/components/AddressCard'
import BlockCardList from '@/components/BlockCardList'
import RepresentativeLabel from '@/components/RepresentativeLabel'
import { AccoutnHistoryBlock } from '@/constants/Types'
import { getAccountBalance, getAccountHistory, getAccountRepresentative } from '@/functions/RPCs'
import { headers } from 'next/headers'

export default async function AddressPage() {

    // https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664
    const headersList = headers()
    // read the custom x-url header
    const header_url = headersList.get('x-url') || ""

    const nanoAddress = header_url.slice(-65)

    const balance = await getAccountBalance(nanoAddress)
    const representative = await getAccountRepresentative(nanoAddress)
    const transactions: AccoutnHistoryBlock[] = await getAccountHistory(nanoAddress)
    
    return (
        <div>
            <AddressCard nanoAddress={nanoAddress} balance={balance} representative={representative}/>
            {/* @ts-expect-error Server Component */}
            <RepresentativeLabel nanoAddress={nanoAddress}/>
            <BlockCardList nanoAddress={nanoAddress} transactions={transactions}/>
        </div>
    )
}