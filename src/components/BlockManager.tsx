"use client"

import { AccountHistoryBlock, CustomBlockPair, WSBlock } from "@/constants/Types"
import { pushBlock, pushBlocks, unshiftBlock } from "@/functions/Functions"
import { WSC } from "@/constants/Socket"
import { getAccountBlockCount, getAccountHistory, getAccountHistoryNext, getAccountReceivable, getBlockInfo } from "@/functions/RPCs"
import { AHBlockToCustomBlock, RPCBlockToCustomBlock, WSBlockToCustomBlock, getBlockPairData } from "@/functions/ServerFunctions"
import SkeletonTextSmall from "./skeletons/SkeletonTextSmall"

import useAsyncEffect from "use-async-effect"
import { useState } from "react"
import BlockCard from "./BlockCard"
import SkeletonTextWide from "./skeletons/SkeletonTextWide"
import SkeletonBlockPair from "./skeletons/SkeletonBlockPair"

export default function BlockManager(props: { nanoAddress: string, subscription: any }) {

    const MAX_BLOCKS = Number.MAX_SAFE_INTEGER

    const [confirmedList, setConfirmedList] = useState<CustomBlockPair[]>([])
    const [confirmedCount, setConfirmedCount] = useState("")

    const [receivableList, setReceivableList] = useState<CustomBlockPair[]>([])
    const [receivableCount, setReceivableCount] = useState("")

    const [confirmedTab, setConfirmedTab] = useState(true)

    const [head, setHead] = useState("")

    useAsyncEffect(async () => {
        if (props.nanoAddress !== "") {
            // get Recieved Blocks
            // push all blocks at once to so there is only 1 refresh
            const confirmedPairArray: CustomBlockPair[] = []
            const blocks: AccountHistoryBlock[] = await getAccountHistory(props.nanoAddress)
            for (const block of blocks) {
                confirmedPairArray.push(await getBlockPairData(await AHBlockToCustomBlock(block, props.nanoAddress)))
            }
            pushBlocks(confirmedList, setConfirmedList, confirmedPairArray, MAX_BLOCKS)

            // get Number of Recieved Blocks
            setConfirmedCount(await getAccountBlockCount(props.nanoAddress))

            // get Recieveable Blocks
            // push all blocks at once to so there is only 1 refresh
            const receivablePairArray: CustomBlockPair[] = []
            const hashes: string[] = await getAccountReceivable(props.nanoAddress)
            for (const hash of hashes) {
                receivablePairArray.push(await getBlockPairData(await RPCBlockToCustomBlock(await getBlockInfo(hash), hash)))
            }
            pushBlocks(receivableList, setReceivableList, receivablePairArray, MAX_BLOCKS)
            
            // get number of Recieveable Blocks
            setReceivableCount(receivablePairArray.length.toString())
        }
        
        // https://elixirforum.com/t/websocket-is-closed-before-the-connection-is-established/40481/5
        WSC.onopen = () => {
            WSC.send(JSON.stringify(props.subscription))
        }
    
        WSC.onmessage = async (msg: any) => {
            let data: WSBlock = JSON.parse(msg.data)
            if (data.topic === "confirmation" && confirmedList.filter((e: CustomBlockPair) => e.block1.hash === data.message.hash).length === 0) {
                if (props.nanoAddress === "" || data.message.account === props.nanoAddress) {
                    unshiftBlock(confirmedList, setConfirmedList, await getBlockPairData(await WSBlockToCustomBlock(data)), MAX_BLOCKS)
                    if (props.nanoAddress !== "") {
                        setConfirmedCount((parseInt(confirmedCount) + 1).toString())
                    }
                    // if (data.message.block.type == "receive") {
                    //     matchBlockPair(WSBlockToCustomBlock(data))
                    // }
                }
            }
        }

        return () => {
            WSC.close()
        }

    }, [])

    // const matchBlockPair = (block: CustomBlock) => {
    //     let array = [...confirmedList] 
    //     for (let i = 0; i < array.length; i ++) {
    //         if (block.link === array[i].block1.hash) {
    //             //doesnt work
    //             //https://stackoverflow.com/questions/36326612/how-to-delete-an-item-from-state-array
    //             array.unshift({block1: block, block2: array.splice(i, 1)[0].block1})
    //         }
    //     }
    // }

    useAsyncEffect(async () => {
        if (head !== "" && confirmedList.length < parseInt(confirmedCount)) {
            pushBlock(confirmedList, setConfirmedList, await getBlockPairData(await AHBlockToCustomBlock(await getAccountHistoryNext(props.nanoAddress, head), props.nanoAddress)), MAX_BLOCKS)
        }
    }, [head])

    return (
        <div className=" my-8">

            {props.nanoAddress !== "" ? 
                <>
                    <div className="flex flex-row justify-between">
                        <button className={`text-lg ${confirmedTab ? "font-medium" : "font-normal text-gray-400"} flex flex-row py-2 px-4`} onClick={() => setConfirmedTab(true)}>
                            <p>Confirmed Transactions</p>
                            <p className="font-mono">&nbsp;</p>
                            {confirmedCount !== "" ?
                                <p className="font-mono">({confirmedCount})</p> :
                                <SkeletonTextSmall />}
                        </button>
                        <button className={`text-lg ${confirmedTab ? "font-normal text-gray-400" : "font-medium"} flex flex-row py-2 px-4`} onClick={() => setConfirmedTab(false)}>
                            <p>Receivable Transactions</p>
                            <p className="font-mono">&nbsp;</p>
                            {receivableCount !== "" ?
                                <p className="font-mono">({receivableCount})</p> :
                                <SkeletonTextSmall />}
                        </button>
                    </div>

                    <div className="min-w-0 flex flex-col h-fit">
                        {confirmedTab ? 
                            confirmedList.map((blockPair: CustomBlockPair, index) => (
                                <BlockCard
                                    key={blockPair.block1.hash}
                                    blockPair={blockPair}
                                    // if second to last visivle, to load next blocks in advanced
                                    isLast={index === confirmedList.length - 2}
                                    newHead={() => setHead(confirmedList[confirmedList.length - 1].block1.hash)}
                                />
                            )) : 
                            receivableList.map((blockPair: CustomBlockPair, index) => (
                                <BlockCard
                                    key={blockPair.block1.hash}
                                    blockPair={blockPair}
                                    // if second to last visivle, to load next blocks in advanced
                                    isLast={index === confirmedList.length - 2}
                                    newHead={() => setHead(confirmedList[confirmedList.length - 1].block1.hash)}
                                />
                            ))
                        }
                    </div>
                </> : 
                <>
                    <div className="text-lg font-medium py-2 px-4">
                        <p>Recently Confirmed Transactions</p>
                    </div>
                    <div className="min-w-0 flex flex-col h-fit">
                        {confirmedList.map((blockPair: CustomBlockPair, index) => (
                            <BlockCard
                            key={blockPair.block1.hash}
                            blockPair={blockPair}
                            />
                            ))}
                    </div>
                </>
            }
            {confirmedList.length === 0 ? 
                <SkeletonBlockPair/> : null}
        </div>
    )
}