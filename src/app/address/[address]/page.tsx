import { NODE } from '@/constants/NodeAddress'
import AddressCard from '@/components/address/[address]/AddressCard'
import RepresentativeLabel from '@/components/address/[address]/RepresentativeLabel'
import TransactionCardList from '@/components/address/[address]/TransactionCardList'
import { tools } from 'nanocurrency-web'
import { headers } from 'next/headers'
import { AccoutnHistoryBlock } from '@/constants/Types'

export default async function AddressPage() {

    // https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664
    const headersList = headers()
    // read the custom x-url header
    const header_url = headersList.get('x-url') || ""

    const nanoAddress = header_url.slice(-65)

    const balance = await getBalance(nanoAddress)
    const representative = await getRepresentative(nanoAddress)
    const transactions: AccoutnHistoryBlock[] = await getAccountHistory(nanoAddress)
    
    return (
        <div>
            <AddressCard nanoAddress={nanoAddress} balance={balance} representative={representative}/>
            {/* @ts-expect-error Server Component */}
            <RepresentativeLabel nanoAddress={nanoAddress}/>
            <TransactionCardList nanoAddress={nanoAddress} transactions={transactions}/>
        </div>
    )
}

// https://docs.nano.org/commands/rpc-protocol/

async function getBalance(nanoAddress: string) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({
            "action": "account_balance",
            "account": nanoAddress
        })
    })
    const data = await result.json()

    return parseFloat(tools.convert(data.balance, 'RAW', 'NANO')).toFixed(6)
}



async function getRepresentative(nanoAddress: string) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({
            "action": "account_representative",
            "account": nanoAddress
        })   
    })
    const data = await result.json()

    return data.representative
}

async function getAccountHistory(nanoAddress: string) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({
            "action": "account_history",
            "account": nanoAddress,
            "count": "100"
        })
    })
    const data = await result.json()
    return data.history
}