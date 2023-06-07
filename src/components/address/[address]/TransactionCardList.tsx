"use client"

import BlockCard from "@/components/block/[block]/BlockCard"
import { WS } from "@/constants/Socket"
import { AccoutnHistoryBlock, CustomBlock, WSBlock } from "@/constants/Types"
import { NODE } from "@/constants/NodeAddress"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

let transactions: CustomBlock[] = []
let previousAccountDictionary: any = {}

export default function TransactionCardList(props: {nanoAddress: string, transactions: AccoutnHistoryBlock[]}) {
    
    const router = useRouter()

    useEffect(() => {
        for (const transaction of props.transactions) {
            const customBlock: CustomBlock = {
                amount: transaction.amount,
                type: transaction.type,
                account: props.nanoAddress,
                accountLink: transaction.account,
                hash: transaction.hash,
                timestamp: transaction.local_timestamp
            }
            transactions.unshift(customBlock)
        }
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
            let data: WSBlock  = JSON.parse(msg.data)
            if (data.topic === "confirmation" && transactions.filter(e => e.hash === data.message.hash).length === 0) {
                if (data.message.account === props.nanoAddress) {
                    if (data.message.block.subtype === "receive") {
                        // get sender address
                        data.message.block.account_link = previousAccountDictionary[data.message.block.link]
                        delete previousAccountDictionary[data.message.block.link]
                    }
                    addTransaction(data)
                    router.refresh()
                } else if (data.message.block.subtype === "send") {
                    // store sender address for later
                    previousAccountDictionary[data.message.hash] = data.message.account
                }
            }
        }
    }, [])

    return (
        <div className="flex flex-col my-6 border divide-y rounded border-sky-700">
            <p className='text-2xl py-2 px-4'>Transactions</p>
            {transactions.map((transaction: any) => (
                <BlockCard key={transaction.hash} block={transaction}/>
            ))}
        </div>
    )
}

async function addTransaction(transaction: WSBlock) {
    let link: any = undefined

    if (transaction.message.block.subtype === "receive") {
        link = transaction.message.block.account_link
        if (link !== undefined) {
            link = await getBlockAddress(transaction.message.hash)
        }
    } 
    else if (transaction.message.block.subtype === "send") {
        link = transaction.message.block.link_as_account
    }

    const customBlock: CustomBlock = {
        amount: transaction.message.amount,
        type: transaction.message.block.subtype,
        account: transaction.message.account,
        accountLink: link,
        hash: transaction.message.hash,
        timestamp: transaction.time
    } 
    transactions.unshift(customBlock)
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