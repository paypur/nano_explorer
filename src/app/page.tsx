"use client"

import { WS } from "@/components/Socket"
import TransactionCard from "@/components/TransactionCard"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

let liveTransactions: any = []
let previousAccountDictionary: any = {}

export default function Home() {
    
    const router = useRouter()

    useEffect(() => {
        WS.onopen = () => {
            const confirmation_subscription = {
                "action": "subscribe", 
                "topic": "confirmation"
            }
            WS.send(JSON.stringify(confirmation_subscription))
        }

        // sender account for receive is wrong
    
        WS.onmessage = (msg) => {
            let data = JSON.parse(msg.data)
            // filter duplicate responses
            if (data.topic === "confirmation" && liveTransactions.filter(e => e.hash === data.message.hash).length === 0) {
                if (data.message.block.subtype === "send") {
                    // store sender address for later
                    previousAccountDictionary[data.message.hash] = data.message.account
                }
                else if (data.message.block.subtype === "receive") {
                    // get sender address
                    // TODO: will still cause problems if send block is sent before websocket is active
                    data.message.block.link_as_account = previousAccountDictionary[data.message.block.link]
                    delete previousAccountDictionary[data.message.block.link]
                }
                addTransaction(data.message)
                router.refresh()
            }
        }
    }, [])

    return (
        <div className="flex flex-col my-6 border divide-y rounded border-sky-700">
            <p className='text-2xl py-2 px-4'>Recent Transactions</p>
            {liveTransactions.map((transaction: any) => (
                <TransactionCard transaction={transaction}></TransactionCard>
            ))}
        </div>
    )
}

function addTransaction(transaction: string) {
    const MAX_TRANSACTIONS = 8
    liveTransactions.unshift(transaction)
    if (liveTransactions.length > MAX_TRANSACTIONS) {
        liveTransactions.pop()
    }
}