import AddressCard from '@/components/address/[address]/AddressCard'
import RepresentativeLabel from '@/components/address/[address]/RepresentativeLabel'
import TransactionsCard from '@/components/address/[address]/TransactionsCard'
import got from 'got'
import { tools } from 'nanocurrency-web'
import { headers } from 'next/headers'

const node = "http://98.35.209.116:7076"

export default async function AddressPage() {

    // https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664
    const headersList = headers()
    // read the custom x-url header
    const header_url = headersList.get('x-url') || ""

    const nanoAddress = header_url.slice(-65)
    const balance = await getBalance(nanoAddress)
    const representative = await getRepresentative(nanoAddress)

    let transactions = await getTransactions(nanoAddress)
    
    //<RepresentativeLabel nanoAddress={nanoAddress}></RepresentativeLabel>

    return (
        <div>
            <AddressCard nanoAddress={nanoAddress} balance={balance} representative={representative}></AddressCard>
            <TransactionsCard nanoAddress={nanoAddress} transactions={transactions}></TransactionsCard>
        </div>
    )
}

// https://docs.nano.org/commands/rpc-protocol/

async function getBalance(nanoAddress: string) {
    const result = await got.post(node, {
        json: {
            "action": "account_balance",
            "account": nanoAddress
        }
    }).json()

    return parseFloat(tools.convert(result.balance, 'RAW', 'NANO')).toFixed(6)
}

async function getRepresentative(nanoAddress: string) {
    const result = await got.post(node, {
        json: {
            "action": "account_representative",
            "account": nanoAddress
          }
          
    }).json()

    return result.representative
}

async function getTransactions(nanoAddress: string) {
    const result = await got.post(node, {
        json: {
            "action": "account_history",
            "account": nanoAddress,
            "count": "100"
        }
    }).json()

    return result.history
}