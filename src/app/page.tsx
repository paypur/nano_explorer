"use client"

import { NODE } from "@/components/NodeAddress"
import { WS } from "@/components/Socket"
import { CustomBlock } from "@/components/TransactionCard"
import TransactionCard from "@/components/TransactionCard"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface WSBlock {
    topic: string
    time: string
    message: {
        account: string
        amount: string
        hash: string
        confirmation_type: string
        block: {
            type: string
            account: string
            previous: string
            representative: string
            balance: string
            link: string
            link_as_account: string
            signature: string
            work: string
            subtype: string
            // non standard
            account_link?: string
        }
    }
}

interface RPCBlock {
    block_account: string
    amount: string
    balance: string
    height: string
    local_timestamp: string
    successor: string
    confirmed: string
    contents: {
        type: string
        account: string
        previous: string
        representative: string
        balance: string
        link: string
        link_as_account: string
        signature: string
        work: string
    },
    subtype: string
}

let liveTransactions: CustomBlock[] = []
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
        WS.onmessage = (msg) => {
            let data: WSBlock = JSON.parse(msg.data)
            // filter duplicate responses
            if (data.topic === "confirmation" && liveTransactions.filter(e => e.hash === data.message.hash).length === 0) {
                if (data.message.block.subtype === "send") {
                    // store sender address for later
                    previousAccountDictionary[data.message.hash] = data.message.account
                }
                else if (data.message.block.subtype === "receive") {
                    // get sender address
                    // TODO: will still cause problems if send block is sent before websocket is active
                    data.message.block.account_link = previousAccountDictionary[data.message.block.link]
                    delete previousAccountDictionary[data.message.block.link]
                }
                addTransaction(data)
                router.refresh()
            }
        }
    }, [])

    return (
        <div className="flex flex-col my-6 border divide-y rounded border-sky-700">
            <p className='font-normal py-2 px-4'>Recent Transactions</p>
            {liveTransactions.map((transaction: CustomBlock) => (
                <TransactionCard block={transaction}/>
            ))}
        </div>
    )
}

async function addTransaction(transaction: WSBlock) {
    const MAX_TRANSACTIONS = 8
    let link = "missing link"

    if (transaction.message.block.subtype === "receive") {
        // TODO: case when acc link undefined
        link = transaction.message.block.account_link
    } 
    else if (transaction.message.block.subtype === "send") {
        // TODO: fetch receive account
        link = await getBlockAddress(transaction.message.hash)
    }

    const customBlock: CustomBlock = {
        amount: transaction.message.amount,
        type: transaction.message.block.subtype,
        account: transaction.message.account,
        accountLink: link,
        hash: transaction.message.hash,
        timestamp: transaction.time
    } 

    liveTransactions.unshift(customBlock)
    if (liveTransactions.length > MAX_TRANSACTIONS) {
        liveTransactions.pop()
    }
}

async function getBlockAddress(hash: string) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({
            "action": "block_account",
            "hash": hash   
        })
    })
    const data = await result.json()
    return data.account
}