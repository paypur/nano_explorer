import AddressCard from '@/components/address/[address]/AddressCard'
import RepresentativeLabel from '@/components/address/[address]/RepresentativeLabel';
import TransactionCard from '@/components/address/[address]/TransactionCard';

import { headers } from 'next/headers';

export default async function AddressPage() {

    // no idea how this works
    // took this from https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664
    const headersList = headers();
    // read the custom x-url header
    const header_url = headersList.get('x-url') || "";

    const nanoAddress = header_url.slice(-65)

    return (
        <div>
            <AddressCard nanoAddress={nanoAddress}></AddressCard>
            <RepresentativeLabel nanoAddress={nanoAddress}></RepresentativeLabel>
            <TransactionCard nanoAddress={nanoAddress}></TransactionCard>
            
        </div>
    )
}
