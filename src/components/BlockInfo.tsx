"use client"

import { AccountHistoryBlock, CustomBlockPair, WSBlock } from "@/constants/Types"
import { AHBlockToCustomBlock, RPCBlockToCustomBlock, WSBlockToCustomBlock, pushBlock, pushBlocks, unshiftBlock } from "@/functions/Functions"
import { getAccountBlockCount, getAccountHistory, getAccountHistoryNext, getAccountsReceivable } from "@/functions/RPCs"
import { WSC } from "@/constants/Socket"
import { getBlockPairData } from "@/functions/ServerFunctions"
import { getBlockInfo } from "@/functions/RPCs"
import BlockCardList from "./BlockCardList"
import SkeletonText from "./skeletons/SkeletonText"
import { useEffect, useState } from "react"

export default function BlockInfo(props: { nanoAddress: string, subscription: any }) {

    const MAX_BLOCKS = Number.MAX_SAFE_INTEGER

    const [confirmedList, setConfirmedList] = useState<CustomBlockPair[]>([])
    const [confirmedCount, setConfirmedCount] = useState("")

    const [receivableList, setReceivableList] = useState<CustomBlockPair[]>([])
    const [receivableCount, setReceivableCount] = useState("")

    const [confirmedTab, setConfirmedTab] = useState(true)

    const [head, setHead] = useState("")

    useEffect(() => {
        if (props.nanoAddress !== "") {
            const getConfirmed = async () => {
                // push all blocks at once to so there is only 1 refresh
                const blockPairArray: CustomBlockPair[] = []
                const blocks: AccountHistoryBlock[] = await getAccountHistory(props.nanoAddress)
                for (const block of blocks) {
                    blockPairArray.push(await getBlockPairData(AHBlockToCustomBlock(block, props.nanoAddress)))
                }
                pushBlocks(confirmedList, setConfirmedList, blockPairArray, MAX_BLOCKS)
            }

            const getConfirmedCount = async () => {
                setConfirmedCount(await getAccountBlockCount(props.nanoAddress))
            }
            
            const getReceivable = async () => {
                // push all blocks at once to so there is only 1 refresh
                const blockPairArray: CustomBlockPair[] = []
                const hashes: string[] = await getAccountsReceivable(props.nanoAddress)
                for (const hash of hashes) {
                    blockPairArray.push(await getBlockPairData(RPCBlockToCustomBlock(await getBlockInfo(hash), hash)))
                }
                pushBlocks(receivableList, setReceivableList, blockPairArray, MAX_BLOCKS)

            }
            
            const getReceivableCount = async () => {
                setReceivableCount((await getAccountsReceivable(props.nanoAddress)).length)
            }
            
            getConfirmed()
            getConfirmedCount()

            getReceivable()
            getReceivableCount()

        }
        
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

        WSC.onopen = () => {
            WSC.send(JSON.stringify(props.subscription))
        }

        WSC.onmessage = async (msg: any) => {
            let data: WSBlock = JSON.parse(msg.data)
            if (data.topic === "confirmation" && confirmedList.filter((e: CustomBlockPair) => e.block1.hash === data.message.hash).length === 0) {
                if (props.nanoAddress === "" || data.message.account === props.nanoAddress) {
                    unshiftBlock(confirmedList, setConfirmedList, await getBlockPairData(WSBlockToCustomBlock(data)), MAX_BLOCKS)
                    // if (data.message.block.type == "receive") {
                    //     matchBlockPair(WSBlockToCustomBlock(data))
                    // }
                }
            }
        }
    }, [])

    useEffect(() => {
        const getNextBlock = async () => {
            if (head !== "" && confirmedList.length < parseInt(confirmedCount)) {
                pushBlock(confirmedList, setConfirmedList, await getBlockPairData(AHBlockToCustomBlock(await getAccountHistoryNext(props.nanoAddress, head), props.nanoAddress)), MAX_BLOCKS)
            }
        }
        getNextBlock()
    }, [head])

    return (
        <div className="my-8">
            {props.nanoAddress !== "" ?
                <>
                    <div className="flex flex-row justify-between">
                        <button className={`text-lg ${confirmedTab ? "font-medium" : "font-normal"} flex flex-row py-2 px-4`} onClick={() => setConfirmedTab(true)}>
                            <p>Confirmed Transactions</p>
                            <p className="font-mono">&nbsp;</p>
                            {confirmedCount !== "" ?
                                    <p className="font-mono">({confirmedCount})</p> :
                                    <SkeletonText />}
                        </button>
                        <button className={`text-lg ${confirmedTab ? "font-normal" : "font-medium"} flex flex-row py-2 px-4`} onClick={() => setConfirmedTab(false)}>
                            <p>Receivable Transactions</p>
                            <p className="font-mono">&nbsp;</p>
                            {/* idk why check for */}
                            {receivableCount !== undefined ?
                                receivableCount !== "" ?
                                    <p className="font-mono">({receivableCount})</p> :
                                    <SkeletonText /> :
                                    null}
                        </button>
                    </div>
                    
                    {confirmedTab ? 
                        <BlockCardList
                            blockList={confirmedList}
                            blockHeight={confirmedCount}
                            newHead={() => setHead(confirmedList[confirmedList.length - 1].block1.hash)}
                        /> 
                        : 
                        <BlockCardList
                            blockList={receivableList}
                        />
                    }
                    
                </>
            :   <>
                    <div className="text-lg font-medium py-2 px-4">
                        <p>Recently Confirmed Transactions</p>
                    </div>
                    <BlockCardList
                        blockList={confirmedList}
                    /> 
                </>
            }
        </div>
    )
}