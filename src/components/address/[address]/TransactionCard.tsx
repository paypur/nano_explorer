import got from "got"
import Link from 'next/link'
import { tools } from 'nanocurrency-web'
import { MdOutlineFileDownload, MdOutlineFileUpload } from "react-icons/md";

const node = "http://98.35.209.116:7076"

// https://stackoverflow.com/questions/63883580/tailwind-css-how-to-style-a-href-links-in-react

export default async function TransactionCard(props) {

    const transactions = await getTransactions(props.nanoAddress)

    return (
        <div className="flex flex-col my-6 border divide-y rounded border-sky-700">
            <p className='text-2xl py-2 px-4'>Transactions: </p>
            {transactions.map((txn: any) => (
                <div className='flex flex-col py-2 px-4 border-sky-700'>
                    {txnHandler(txn)}
                    <Link className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={"/address/" + txn.account}><p>{txn.account}</p></Link>  
                    <Link className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={"/block/" + txn.hash}><p>{txn.hash}</p></Link>
                </div>
            ))}
        </div>
    )
}

function txnHandler(txn) {
    const amount = <p className="text-white">Ӿ{parseFloat(tools.convert(txn.amount, 'RAW', 'NANO')).toFixed(6)}</p>
    if (txn.type === "receive") {
        return <div className="flex flex-row text-emerald-600">
            <MdOutlineFileDownload size="1.25rem"/> 
            <p className="ml-1 mr-2">received</p>
            {amount}
        </div> 
    } else {
        return <div className="flex flex-row text-rose-600">
            <MdOutlineFileUpload size="1.25rem"/>
            <p className="ml-1 mr-2">sent</p>
            {amount}
        </div>
    }

}

// https://docs.nano.org/commands/rpc-protocol/

async function getTransactions(nanoAddress: string) {
    const result = await got.post(node, {
        json: {
            "action": "account_history",
            "account": nanoAddress,
            "count": "-1"
        }
    }).json()

    return result.history
}