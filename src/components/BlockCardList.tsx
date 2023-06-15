"use client"

import BlockCard from "@/components/BlockCard"
import { WS } from "@/constants/Socket"
import { AccountHistoryBlock , CustomBlock, WSBlock } from "@/constants/Types"
import { getAccountBlockCount, getAccountHistoryNext, getBlockAccount } from "@/functions/RPCs"
import { useEffect, useState } from "react"

export default function BlockCardList(props: { nanoAddress: string, subscription: any, transactions: AccountHistoryBlock[], MAX_TRANSACTIONS: number }) {
    
    const [transactions, setTransactions] = useState<CustomBlock[]>([])
    const [LinkDictionary, setLinkDictionary] = useState<any>({})
    const [transactionsCount, setTransactionsCount] = useState("")

    const pushTransaction = (transaction: any) => {
        setTransactions(prev => [...prev, transaction])
        if (transactions.length > props.MAX_TRANSACTIONS) {
            setTransactions(transactions.slice(0, -1))
        }
    }

    const unshiftTransaction = (transaction: any) => {
        setTransactions(prev => [transaction, ...prev])
        if (transactions.length > props.MAX_TRANSACTIONS) {
            setTransactions(transactions.slice(0, -1))
        }
    }

    const addLink = (key: string, value: string) => {
        setLinkDictionary({ ...LinkDictionary, [key]: value })
    }

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

    const AccountHistoryBlockToCustomBlock = (transaction: AccountHistoryBlock) => {
        return ({
            amount: transaction.amount,
            type: transaction.subtype,
            account: props.nanoAddress,
            accountLink: transaction.account,
            hash: transaction.hash,
            timestamp: (parseInt(transaction.local_timestamp) * 1000).toString()
        } as CustomBlock)
    }
    
    const getTranactionsCount = async () => {
        let x = await getAccountBlockCount(props.nanoAddress)
        setTransactionsCount(props.nanoAddress !== "" ? x : "")
    }

    const getNextTransaction = async () => {
        if (transactions[transactions.length - 1].hash !== "" && transactions.length < parseInt(transactionsCount)) {
            pushTransaction(AccountHistoryBlockToCustomBlock(await getAccountHistoryNext(props.nanoAddress, transactions[transactions.length - 1].hash)))
        }
    }
    
    useEffect(() => {
        getTranactionsCount()
        
        for (const transaction of props.transactions) {
            pushTransaction(AccountHistoryBlockToCustomBlock(transaction))
        }
        
        WS.onopen = () => {
            WS.send(JSON.stringify(props.subscription))
        }
        // super ugly
        WS.onmessage = async (msg) => {
            let data: WSBlock = JSON.parse(msg.data)
            if (data.topic === "confirmation" && transactions.filter(e => e.hash === data.message.hash).length === 0) {
                if (props.nanoAddress === "") {
                    if (data.message.block.subtype === "send") {
                        // store sender address for later
                        addLink(data.message.hash, data.message.account)
                    }
                    else if (data.message.block.subtype === "receive") {
                        // get sender address
                        data.message.block.account_link = LinkDictionary[data.message.block.link]
                        let keyToDelete = data.message.block.link
                        // delete used key
                        setLinkDictionary((current: any) => {
                            const { keyToDelete, ...restOfKeys } = current;
                            return restOfKeys;
                        })
                    }
                    unshiftTransaction(await WSBlockTOCustomBlock(data))
                } else if (data.message.account === props.nanoAddress) {
                    if (data.message.block.subtype === "receive") {
                        // get sender address
                        data.message.block.account_link = LinkDictionary[data.message.block.link]
                        let keyToDelete = data.message.block.link
                        // delete used key
                        setLinkDictionary((current: any) => {
                            const { keyToDelete, ...restOfKeys } = current;
                            return restOfKeys;
                        })
                    }
                    unshiftTransaction(await WSBlockTOCustomBlock(data))
                } else if (data.message.block.subtype === "send") {
                    // store sender address for later
                    addLink(data.message.hash, data.message.account)
                }
            }
        }
    }, [])
    

    return (    
        <div className="flex flex-col my-6 border divide-y rounded border-sky-700">
            <div className="py-2 px-4">
                <p>Transactions<span className="font-mono">&nbsp;{transactionsCount !== "" ? `(${transactionsCount})` : ""}</span></p>
            </div>
            {props.nanoAddress !== "" ? 
            transactions.map((transaction: CustomBlock, index) => (
                <BlockCard key={transaction.hash} block={transaction}
                isLast={index === transactions.length - 1}
                /*https://stackoverflow.com/questions/41446560/react-setstate-not-updating-state*/
                newLimit={() => setTimeout(() =>  getNextTransaction(), 10)}/>
            )) : 
            transactions.map((transaction: CustomBlock) => (
                <BlockCard key={transaction.hash} block={transaction}/>
            ))}
        </div>
    )
}