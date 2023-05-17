"use client"

import TransactionCard from '@/components/TransactionCard'

import { useRouter } from 'next/navigation'
import WebSocket, { WebSocketServer } from 'ws'
import ReconnectingWebSocket from 'reconnecting-websocket'

let liveTransactions: any[] = []

export default function Home() {
    
    const router = useRouter()

    const ws = new ReconnectingWebSocket('ws://98.35.209.116:7078')

    ws.onopen = () => {
        const confirmation_subscription = {
            "action": "subscribe", 
            "topic": "confirmation"
        }
        ws.send(JSON.stringify(confirmation_subscription))
    
        // Other subscriptions can go here
    }

    ws.onmessage = (msg) => {
        let data_json = JSON.parse(msg.data)
        if (data_json.topic === "confirmation" && liveTransactions.filter(e => e.hash === data_json.message.hash).length === 0) {
            addTransaction(data_json.message)
            router.refresh()
        }
    }

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