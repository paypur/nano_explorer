"use client"

import BlockCard from "@/components/BlockCard"
import { WS } from "@/constants/Socket"
import { CustomBlock, WSBlock } from "@/constants/Types"
import { getBlockAccount } from "@/functions/RPCs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

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
                <BlockCard key={transaction.hash} block={transaction}/>
            ))}
        </div>
    )
}

async function addTransaction(transaction: WSBlock) {
    const MAX_TRANSACTIONS = 20
    let link: any = undefined

    if (transaction.message.block.subtype === "receive") {
        link = transaction.message.block.account_link
        if (link !== "") {
            link = await getBlockAccount(transaction.message.block.link)
        }
    } 
    else if (transaction.message.block.subtype === "send") {
        link = transaction.message.block.link_as_account
    }

    liveTransactions.unshift({
        amount: transaction.message.amount,
        type: transaction.message.block.subtype,
        account: transaction.message.account,
        accountLink: link,
        hash: transaction.message.hash,
        timestamp: transaction.time
    } as CustomBlock)

    if (liveTransactions.length > MAX_TRANSACTIONS) {
        liveTransactions.pop()
    }
}