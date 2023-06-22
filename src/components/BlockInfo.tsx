"use client"

import { WS } from "@/constants/Socket"
import { AccountHistoryBlock, CustomBlock, WSBlock } from "@/constants/Types"
import { AccountHistoryBlockToCustomBlock, RPCBlockTOCustomBlock, WSBlockTOCustomBlock } from "@/functions/Functions"
import { getAccountBlockCount, getAccountHistory, getAccountHistoryNext, getAccountRepresentative, getAccountsReceivable, getBlockInfo } from "@/functions/RPCs"
import { useEffect, useState } from "react"
import BlockCardList from "./BlockCardList"

export default function BlockInfo(props: { nanoAddress: string, MAX_BLOCKS: number, subscription: any }) {

    const [receivableList, setReceivableList] = useState<CustomBlock[]>([])
    //const [receivableCount, setReceivableCount] = useState("")
    
    const [confirmedList, setConfirmedList] = useState<CustomBlock[]>([])
    const [confirmedCount, setConfirmedCount] = useState("")

    const [LinkDictionary, setLinkDictionary] = useState<any>({})
    const [head, setHead] = useState("")

    const pushBlock = (blockList: any, setFunction: any, block: CustomBlock) => {
        setFunction((prev: any) => [...prev, block])
        if (blockList.length > props.MAX_BLOCKS) {
            setFunction(confirmedList.slice(0, -1))
        }
    }

    const unshiftBlock = (blockList: any, setFunction: any, block: CustomBlock) => {
        setFunction((prev: any) => [block, ...prev])
        if (blockList.length > props.MAX_BLOCKS) {
            setFunction(blockList.slice(0, -1))
        }
    }

    const addLink = (key: string, value: string) => {
        setLinkDictionary({ ...LinkDictionary, [key]: value })
    }
    
    const getReceivable = async () => {
        const hashList: string[] = await getAccountsReceivable(props.nanoAddress)
        if (hashList !== undefined) {
            for (const hash of hashList) {
                unshiftBlock(receivableList, setReceivableList, await RPCBlockTOCustomBlock(hash, await getBlockInfo(hash)))
            }
        }
    }
    
    const getConfirmedCount = async () => {
        setConfirmedCount(await getAccountBlockCount(props.nanoAddress))
    }

    const getConfirmed = async () => {
        const blocks: AccountHistoryBlock[] = await getAccountHistory(props.nanoAddress)
        for (const block of blocks) {
            pushBlock(confirmedList, setConfirmedList, AccountHistoryBlockToCustomBlock(block, props.nanoAddress))
        }
    }

    const getNextBlock = async () => {
        if (head !== "" && confirmedList.length < parseInt(confirmedCount)) {
            pushBlock(confirmedList, setConfirmedList, AccountHistoryBlockToCustomBlock(await getAccountHistoryNext(props.nanoAddress, head), props.nanoAddress))
        }
    }

    useEffect(() => {
        if (props.nanoAddress !== "") {
            getReceivable()
            getConfirmed()
            getConfirmedCount()
        }

        WS.onopen = () => {
            WS.send(JSON.stringify(props.subscription))
        }
        // super ugly
        WS.onmessage = async (msg) => {
            let data: WSBlock = JSON.parse(msg.data)
            if (data.topic === "confirmation" && confirmedList.filter(e => e.hash === data.message.hash).length === 0) {
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
                    unshiftBlock(confirmedList, setConfirmedList, await WSBlockTOCustomBlock(data))
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
                    unshiftBlock(confirmedList, setConfirmedList, await WSBlockTOCustomBlock(data))
                } else if (data.message.block.subtype === "send") {
                    // store sender address for later
                    addLink(data.message.hash, data.message.account)
                    unshiftBlock(receivableList, setReceivableList, await WSBlockTOCustomBlock(data))
                }
            }
        }
    }, [])

    useEffect(() => {
        getNextBlock()
    }, [head])

    if (props.nanoAddress === "") {
        return (
            <div className="my-8">
                <BlockCardList blockList={confirmedList} blockHeight={confirmedCount} text={"Confirmed Transactions"}/>
            </div>
        )       
    } else {
        return (
            <div className="flex flex-row space-x-8 my-8">
                {receivableList.length !== 0 ? <BlockCardList blockList={receivableList} blockHeight={receivableList.length.toString()} text={"Receivable Transactions"} />: null}
                <BlockCardList blockList={confirmedList} blockHeight={confirmedCount} text={"Confirmed Transactions"} newHead={() => setHead(confirmedList[confirmedList.length - 1].hash)}/>
            </div>
        )
    }
    // <div className="w-full flex flex-col my-6 border border-sky-700 divide-y rounded">
    //     <div className="py-2 px-4">
    //         <p>{props.text}<span className="font-mono">&nbsp;{transactionsCount !== "" ? `(${transactionsCount})` : ""}</span></p>
    //     </div>
    //     {confirmedList.map((transaction: CustomBlock, index) => (
    //         <BlockCard
    //             key={transaction.hash}
    //             block={transaction}
    //             isLast={index === confirmedList.length - 1}
    //             newHead={() => setHead(confirmedList[confirmedList.length - 1].hash)}
    //         />
    //     ))}
    // </div>
}