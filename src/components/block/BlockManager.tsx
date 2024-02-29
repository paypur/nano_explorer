"use client"

import { CustomBlockPair, WSBlock } from "@/constants/Types"
import { WSC } from "@/constants/Socket"
import BlockCard from "./BlockCard"
import { getAccountBlockCount } from "@/functions/RPCs"
import { convertWSBlock, getAHN, getAccountLatestBlocks, getAccountReceivableBlocks } from "@/functions/ServerFunctions"
import SkeletonBlockPair from "../skeletons/SkeletonBlockPair"

import useAsyncEffect from "use-async-effect"
import { useState } from "react"
import { SkeletonText2rem } from "../skeletons/SkeletonText"

export default function BlockManager(props: { nanoAddress: string, subscription: any }) {

    const MAX_BLOCKS = 64

    const [confirmedList, setConfirmedList] = useState<CustomBlockPair[]>([])
    const [confirmedTotal, setConfirmedTotal] = useState<number|null>(null)

    const [receivableList, setReceivableList] = useState<CustomBlockPair[]>([])

    const [head, setHead] = useState("")

    const [confirmedTab, setConfirmedTab] = useState(true)

    useAsyncEffect(async () => {
        
        if (props.nanoAddress !== "") {
            // get Recieved Blocks
            // push all blocks at once to so there is only 1 refresh
            const latestBlocks = await getAccountLatestBlocks(props.nanoAddress)
            // adds to end
            setConfirmedList(latestBlocks)

            // get total Number of Recieved Blocks
            setConfirmedTotal(await getAccountBlockCount(props.nanoAddress))

            // get Recieveable Blocks
            // push all blocks at once to so there is only 1 refresh
            const receivablePairArray = await getAccountReceivableBlocks(props.nanoAddress)
            // adds to end
            setReceivableList((prev: any) => [...prev, ...receivablePairArray])
        }

        // https://elixirforum.com/t/websocket-is-closed-before-the-connection-is-established/40481/5
        WSC.onopen = () => {
            WSC.send(JSON.stringify(props.subscription))
        }

        WSC.onmessage = async (msg: any) => {
            let data: WSBlock = JSON.parse(msg.data)
            if (data.topic === "confirmation" && confirmedList.filter((e: CustomBlockPair) => e.block1.hash === data.message.hash).length === 0) {
                if (props.nanoAddress === "" || data.message.account === props.nanoAddress) {
                    const block =  await convertWSBlock(data)
                    // adds to front
                    if (props.nanoAddress !== "") {
                        setConfirmedList((prev: any) => [block, ...prev])
                    }
                    else {
                        setConfirmedList((prev: any) => [block, ...prev].splice(0, MAX_BLOCKS))
                    }

                    if (props.nanoAddress !== "") {
                        setConfirmedTotal(confirmedTotal + 1)
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
        if (head !== "" && confirmedList.length < confirmedTotal) {
            const block = await getAHN(props.nanoAddress, head)
            // adds to end
            setConfirmedList((prev: any) => [...prev, block])
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
                            {confirmedTotal !== null ?
                                <p className="font-mono">({confirmedTotal})</p> :
                                <SkeletonText2rem />}
                        </button>
                        <button className={`text-lg ${confirmedTab ? "font-normal text-gray-400" : "font-medium"} flex flex-row py-2 px-4`} onClick={() => setConfirmedTab(false)}>
                            <p>Receivable Transactions</p>
                            <p className="font-mono">&nbsp;</p>
                            {receivableList.length !== null ?
                                <p className="font-mono">({receivableList.length})</p> :
                                <SkeletonText2rem />}
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
                    <div className="flex flex-row justify-between">
                        <p className="text-lg font-medium py-2 px-4">Recently Confirmed Transactions</p>
                        <p className="text-lg font-medium py-2 px-4">CPS: 0</p>
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
                <SkeletonBlockPair /> : null}
        </div>
    )
}