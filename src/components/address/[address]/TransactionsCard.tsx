"use client"

import { WS } from "@/components/Socket"
import TransactionCard from "@/components/TransactionCard"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

let transactions: any = []
let previousAccountDictionary: any = {}

export default function TransactionsCard(props: {nanoAddress: string, transactions: any}) {
    
    const router = useRouter()

    useEffect(() => {
        transactions = props.transactions
        router.refresh()
        
        WS.onopen = () => {
            const confirmation_subscription = {
                "action": "subscribe", 
                "topic": "confirmation",
                "options": {
                    "accounts": [props.nanoAddress]
                }
            }
            WS.send(JSON.stringify(confirmation_subscription))
        }
        
        WS.onmessage = (msg) => {
            let data = JSON.parse(msg.data)
            if (data.topic === "confirmation" && transactions.filter(e => e.hash === data.message.hash).length === 0) {
                if (data.message.account === props.nanoAddress) {
                    if (data.message.block.subtype === "receive") {
                        // get sender address
                        // TODO: will still cause problems if send block is sent before websocket is active
                        data.message.block.link_as_account = previousAccountDictionary[data.message.block.link]
                        previousAccountDictionary[data.message.block.link]
                    }
                    transactions.unshift(data.message)
                    router.refresh()
                } else if (data.message.block.subtype === "send") {
                    // store sender address for later
                    previousAccountDictionary[data.message.hash] = data.message.account
                }
            }
        }
    }, [])

    if (transactions.length !== 0) {
        return (
            <div className="flex flex-col my-6 border divide-y rounded border-sky-700">
                <p className='text-2xl py-2 px-4'>Transactions</p>
                {transactions.map((transaction: any) => (
                    <TransactionCard transaction={transaction}></TransactionCard>
                ))}
            </div>
        )
    }
    else {
        return null
    }
}

// 170MB transfer
// 1.5 mins
//{"action": "account_history","account": "nano_1banexkcfuieufzxksfrxqf6xy8e57ry1zdtq9yn7jntzhpwu4pg4hajojmq","count": "-1"}