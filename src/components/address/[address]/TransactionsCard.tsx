"use client"

import { WS } from "@/components/Socket"
import TransactionCard from "@/components/TransactionCard"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

let transactions: any = []

export default function TransactionsCard(props: {nanoAddress: string, transactions: any}) {
    
    const router = useRouter()
    const [sendAddress, setSendAddress] = useState()

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
            let data_json = JSON.parse(msg.data)
            if (data_json.topic === "confirmation" && transactions.filter(e => e.hash === data_json.message.hash).length === 0) {
                //TODO: still doesnt work
                if (data_json.message.account === props.nanoAddress) {
                    // override with senders address
                    data_json.message.block.link_as_account = sendAddress
                    transactions.unshift(data_json.message)
                    router.refresh()
                }
                // use send block to get sender address
                else {
                    setSendAddress(data_json.message.account)
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