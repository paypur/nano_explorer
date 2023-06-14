"use client"

import BlockCard from "@/components/BlockCard"
import { WS } from "@/constants/Socket"
import { AccountHistoryBlock, CustomBlock, WSBlock } from "@/constants/Types"

import { useEffect, useState } from "react"
import { getBlockAccount } from "@/functions/RPCs"


export default function BlockCardList(props: { nanoAddress: string, subscription: any, transactions: AccountHistoryBlock[], MAX_TRANSACTIONS: number }) {

    let [transactions, setTransactions] = useState<CustomBlock[]>([])
    let [previousAccountDictionary, setPreviousAccountDictionary] = useState<any>({})

    const WSBlockTOCustomBlock = async (transaction: WSBlock) => {
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
        return ({
            amount: transaction.message.amount,
            type: transaction.message.block.subtype,
            account: transaction.message.account,
            accountLink: link,
            hash: transaction.message.hash,
            timestamp: transaction.time
        } as CustomBlock)
    }

    const pushTransaction = (transaction) => {
        setTransactions(prev => [...prev, transaction])
        if (transactions.length > props.MAX_TRANSACTIONS) {
            setTransactions(transactions.slice(0, -1))
        }
    }

    const unshiftTransaction = (transaction) => {
        setTransactions(prev => [transaction, ...prev])
        if (transactions.length > props.MAX_TRANSACTIONS) {
            setTransactions(transactions.slice(0, -1))
        }
    }

    const addAccount = (key: string, value: string) => {
        setPreviousAccountDictionary({ ...previousAccountDictionary, [key]: value })
    }

    useEffect(() => {
        for (const transaction of props.transactions) {
            pushTransaction({
                amount: transaction.amount,
                type: transaction.subtype,
                account: props.nanoAddress,
                accountLink: transaction.account,
                hash: transaction.hash,
                timestamp: (parseInt(transaction.local_timestamp) * 1000).toString()
            } as CustomBlock)
        }

        WS.onopen = () => {
            WS.send(JSON.stringify(props.subscription))
        }

        WS.onmessage = async (msg) => {
            let data: WSBlock = JSON.parse(msg.data)
            if (data.topic === "confirmation" && transactions.filter(e => e.hash === data.message.hash).length === 0) {
                if (props.nanoAddress === "") {
                    if (data.message.block.subtype === "send") {
                        // store sender address for later
                        addAccount(data.message.hash, data.message.account)
                    }
                    else if (data.message.block.subtype === "receive") {
                        // get sender address
                        data.message.block.account_link = previousAccountDictionary[data.message.block.link]
                        let keyToDelete = data.message.block.link
                        // delete used key
                        setPreviousAccountDictionary((current) => {
                            const { keyToDelete, ...restOfKeys } = current;
                            return restOfKeys;
                        })
                    }
                    unshiftTransaction(await WSBlockTOCustomBlock(data))
                } else if (data.message.account === props.nanoAddress) {
                    if (data.message.block.subtype === "receive") {
                        // get sender address
                        data.message.block.account_link = previousAccountDictionary[data.message.block.link]
                        let keyToDelete = data.message.block.link
                        // delete used key
                        setPreviousAccountDictionary((current) => {
                            const { keyToDelete, ...restOfKeys } = current;
                            return restOfKeys;
                        })
                    }
                    unshiftTransaction(await WSBlockTOCustomBlock(data))
                } else if (data.message.block.subtype === "send") {
                    // store sender address for later
                    addAccount(data.message.hash, data.message.account)
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
                <BlockCard key={transaction.hash} block={transaction} />
            ))}
        </div>
    )
}