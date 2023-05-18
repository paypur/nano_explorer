import TransactionCard from "@/components/TransactionCard"

import got from "got"

const node = "http://98.35.209.116:7076"

// https://stackoverflow.com/questions/63883580/tailwind-css-how-to-style-a-href-links-in-react

export default async function TransactionsCard(props) {

    const transactions = await getTransactions(props.nanoAddress)

    return (
        <div className="flex flex-col my-6 border divide-y rounded border-sky-700">
            <p className='text-2xl py-2 px-4'>Transactions</p>
            {transactions.map((transaction: any) => (
                <TransactionCard transaction={transaction}></TransactionCard>
            ))}
        </div>
    )
}

// https://docs.nano.org/commands/rpc-protocol/

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

// 170MB transfer
// 1.5 mins
//{"action": "account_history","account": "nano_1banexkcfuieufzxksfrxqf6xy8e57ry1zdtq9yn7jntzhpwu4pg4hajojmq","count": "-1"}