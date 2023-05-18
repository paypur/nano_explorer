"use client"

import { WS } from '@/components/Socket'
import TransactionCard from '@/components/TransactionCard'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

let liveTransactions: any[] = []

export default function Home() {
    
    const router = useRouter()

    useEffect(() => {
        WS.onopen = () => {
            const confirmation_subscription = {
                "action": "subscribe", 
                "topic": "confirmation"
            }
            WS.send(JSON.stringify(confirmation_subscription))
        
            // Other subscriptions can go here
        }
    
        WS.onmessage = (msg) => {
            let data_json = JSON.parse(msg.data)
            if (data_json.topic === "confirmation" && liveTransactions.filter(e => e.hash === data_json.message.hash).length === 0) {
                addTransaction(data_json.message)
                router.refresh()
            }
        }
    }, [])

    return (
        <div className="flex flex-col my-6 border divide-y rounded border-sky-700">
            <p className='text-2xl py-2 px-4'>Recent Transactions</p>
            {liveTransactions.map((transaction: string) => (
                <TransactionCard transaction={transaction}></TransactionCard>
            ))}
        </div>
    )
}

function addTransaction(transaction: string) {
    const MAX_TRANSACTIONS = 6
    liveTransactions.unshift(transaction)
    if (liveTransactions.length > MAX_TRANSACTIONS) {
        liveTransactions.pop()
    }
}