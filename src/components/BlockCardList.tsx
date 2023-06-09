"use client"

import BlockCard from "@/components/BlockCard"
import { WS } from "@/constants/Socket"
import { AccountHistoryBlock, CustomBlock, WSBlock } from "@/constants/Types"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { getBlockAccount } from "@/functions/RPCs"

let transactions: CustomBlock[] = []
let previousAccountDictionary: any = {}

export default function BlockCardList(props: {nanoAddress: string, subscription: any, transactions: AccountHistoryBlock[], MAX_TRANSACTIONS: number}) {
    
    const router = useRouter()
    
    const addTransaction = async (transaction: WSBlock) => {
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
    
        transactions.unshift({
            amount: transaction.message.amount,
            type: transaction.message.block.subtype,
            account: transaction.message.account,
            accountLink: link,
            hash: transaction.message.hash,
            timestamp: transaction.time
        } as CustomBlock)
    
        if (transactions.length > props.MAX_TRANSACTIONS) {
            transactions.pop()
        }
    }

    useEffect(() => {
        for (const transaction of props.transactions) {
            transactions.push({
                amount: transaction.amount,
                type: transaction.type,
                account: props.nanoAddress,
                accountLink: transaction.account,
                hash: transaction.hash,
                timestamp: (parseInt(transaction.local_timestamp) * 1000).toString()
            } as CustomBlock)
        }
        router.refresh()
        
        WS.onopen = () => {
            WS.send(JSON.stringify(props.subscription))
        }
        
        WS.onmessage = (msg) => {
            let data: WSBlock  = JSON.parse(msg.data)
            if (data.topic === "confirmation" && transactions.filter(e => e.hash === data.message.hash).length === 0) {
                if (props.nanoAddress === "") {
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
                } else if (data.message.account === props.nanoAddress) {
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
            <div className="flex flex-row py-2 px-4">
                <p>Transactions&nbsp;</p>
                <p className="font-mono">({transactions.length})</p>
            </div>
            {transactions.map((transaction: any) => (
                <BlockCard key={transaction.hash} block={transaction}/>
            ))}
        </div>
    )
}