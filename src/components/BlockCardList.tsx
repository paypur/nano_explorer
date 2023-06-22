"use client"

import BlockCard from "@/components/BlockCard"
import { WS } from "@/constants/Socket"
import { AccountHistoryBlock, CustomBlock, WSBlock } from "@/constants/Types"
import { getAccountBlockCount, getAccountHistoryNext, getBlockAccount } from "@/functions/RPCs"
import { useEffect, useState } from "react"

export default function BlockCardList(props: { nanoAddress: string, blocks: AccountHistoryBlock[], MAX_BLOCKS: number, text: string, subscription: any }) {

    const [receivableList, setReceivableList] = useState<CustomBlock[]>([])
    const [blockList, setBlockList] = useState<CustomBlock[]>([])
    const [LinkDictionary, setLinkDictionary] = useState<any>({})
    const [head, setHead] = useState("")
    const [transactionsCount, setTransactionsCount] = useState("")

    const pushBlock = (block: any) => {
        setBlockList(prev => [...prev, block])
        if (blockList.length > props.MAX_BLOCKS) {
            setBlockList(blockList.slice(0, -1))
        }
    }

    const unshiftBlock = (block: any) => {
        setBlockList(prev => [block, ...prev])
        if (blockList.length > props.MAX_BLOCKS) {
            setBlockList(blockList.slice(0, -1))
        }
    }

    const addLink = (key: string, value: string) => {
        setLinkDictionary({ ...LinkDictionary, [key]: value })
    }

    const WSBlockTOCustomBlock = async (block: WSBlock) => {
        let link: any = undefined
        if (block.message.block.subtype === "receive") {
            link = block.message.block.account_link
            if (link !== "") {
                link = await getBlockAccount(block.message.block.link)
            }
        } else if (block.message.block.subtype === "send") {
            link = block.message.block.link_as_account
        }
        return ({
            amount: block.message.amount,
            type: block.message.block.subtype,
            account: block.message.account,
            accountLink: link,
            hash: block.message.hash,
            timestamp: block.time
        } as CustomBlock)
    }

    const AccountHistoryBlockToCustomBlock = (block: AccountHistoryBlock) => {
        return ({
            amount: block.amount,
            type: block.subtype,
            account: props.nanoAddress,
            accountLink: block.account,
            hash: block.hash,
            timestamp: (parseInt(block.local_timestamp) * 1000).toString()
        } as CustomBlock)
    }

    const getBlockCount = async () => {
        let x = await getAccountBlockCount(props.nanoAddress)
        setTransactionsCount(props.nanoAddress !== "" ? x : "")
    }

    const getNextBlock = async () => {
        if (head !== "" && blockList.length < parseInt(transactionsCount)) {
            pushBlock(AccountHistoryBlockToCustomBlock(await getAccountHistoryNext(props.nanoAddress, head)))
        }
    }

    useEffect(() => {
        getBlockCount()

        for (const block of props.blocks) {
            pushBlock(AccountHistoryBlockToCustomBlock(block))
        }

        WS.onopen = () => {
            WS.send(JSON.stringify(props.subscription))
        }
        // super ugly
        WS.onmessage = async (msg) => {
            let data: WSBlock = JSON.parse(msg.data)
            if (data.topic === "confirmation" && blockList.filter(e => e.hash === data.message.hash).length === 0) {
                if (props.nanoAddress === "") {
                    if (data.message.block.subtype === "send") {
                        // store sender address for later
                        addLink(data.message.hash, data.message.account)
                    } else if (data.message.block.subtype === "receive") {
                        // get sender address
                        data.message.block.account_link = LinkDictionary[data.message.block.link]
                        // delete used key
                        let keyToDelete = data.message.block.link
                        setLinkDictionary((current: any) => {
                            const { keyToDelete, ...restOfKeys } = current;
                            return restOfKeys;
                        })
                    }
                    unshiftBlock(await WSBlockTOCustomBlock(data))
                } else if (data.message.account === props.nanoAddress) {
                    if (data.message.block.subtype === "receive") {
                        // get sender address
                        data.message.block.account_link = LinkDictionary[data.message.block.link]
                        // delete used key
                        let keyToDelete = data.message.block.link
                        setLinkDictionary((current: any) => {
                            const { keyToDelete, ...restOfKeys } = current;
                            return restOfKeys;
                        })
                    }
                    unshiftBlock(await WSBlockTOCustomBlock(data))
                } else if (data.message.block.subtype === "send") {
                    // store sender address for later
                    addLink(data.message.hash, data.message.account)
                }
            }
        }
    }, [])

    useEffect(() => {
        getNextBlock()
    }, [head])

    return (
        <div className="w-full flex flex-col my-6 border border-sky-700 divide-y rounded">
            <div className="py-2 px-4">
                <p>{props.text}<span className="font-mono">&nbsp;{transactionsCount !== "" ? `(${transactionsCount})` : ""}</span></p>
            </div>
            {props.nanoAddress !== "" ?
                blockList.map((transaction: CustomBlock, index) => (
                    <BlockCard key={transaction.hash} block={transaction}
                        isLast={index === blockList.length - 1}
                        newLimit={() => setHead(blockList[blockList.length - 1].hash)} />
                )) :
                blockList.map((transaction: CustomBlock) => (
                    <BlockCard key={transaction.hash} block={transaction} />
                ))}
        </div>
    )
}