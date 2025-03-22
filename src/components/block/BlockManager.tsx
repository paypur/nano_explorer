"use client"

import { CustomBlockPair, WSBlock } from "@/constants/Types"
import { WSC } from "@/constants/Socket"
import BlockCard from "./BlockCard"
import { getAccountBlockCount } from "@/server_functions/RPCs"
import { convertWSBlock, convertAHN, getAccountLatestBlocks, getAccountReceivableBlocks } from "@/server_functions/ServerFunctions"
import SkeletonBlockPair from "../skeletons/SkeletonBlockPair"

import useAsyncEffect from "use-async-effect"
import { useEffect, useState } from "react"
import { SkeletonText2rem } from "../skeletons/SkeletonText"

export default function BlockManager(props: { nanoAddress: string, subscription: any }) {

    const MAX_BLOCKS = 64

    const [confirmedList, setConfirmedList] = useState<CustomBlockPair[]>([])
    const [confirmedTotal, setConfirmedTotal] = useState<number | null>(null)

    const [receivableList, setReceivableList] = useState<CustomBlockPair[]>([])

    const [head, setHead] = useState("")

    const [confirmedTab, setConfirmedTab] = useState(true)

    useAsyncEffect(async () => {

        if (props.nanoAddress !== "") {
            // get Received Blocks
            // push all blocks at once to so there is only 1 refresh
            const latestBlocks = await getAccountLatestBlocks(props.nanoAddress)
            // adds to end
            setConfirmedList(latestBlocks)

            // get total Number of Recieved Blocks
            setConfirmedTotal(await getAccountBlockCount(props.nanoAddress))

            // get Receiveable Blocks
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
                    // setTime(new Date().getTime())

                    const block = await convertWSBlock(data)
                    // adds to front
                    if (props.nanoAddress !== "") {
                        setConfirmedList((prev: any) => [block, ...prev])
                        setConfirmedTotal(confirmedTotal! + 1)
                    } else {
                        setConfirmedList((prev: any) => [block, ...prev].splice(0, MAX_BLOCKS))
                    }
                }

            }
        }

        return () => {
            WSC.close()
        }

    }, [])

    useAsyncEffect(async () => {
        if (head !== "" && confirmedList.length < confirmedTotal!) {
            const block = await convertAHN(props.nanoAddress, head)
            // adds to end
            setConfirmedList((prev: any) => [...prev, block])
        }
    }, [head])

    return (
        <div className="flex flex-col my-4 px-4 space-y-2">
            {props.nanoAddress !== "" ?
                <>
                    <div className="flex flex-row justify-between">
                        <button className={`${confirmedTab ? "font-medium bg-neutral-50 text-black" : "font-normal text-neutral-50 border"} flex flex-row rounded py-0.5 px-2`} onClick={() => setConfirmedTab(true)}>
                            <p className={"pt-[1px]"}>Confirmed Transactions</p>
                            <p className="font-mono">&nbsp;</p>
                            {confirmedTotal !== null ? <p className="font-mono">({confirmedTotal})</p> : <SkeletonText2rem />}
                        </button>
                        <button className={`${confirmedTab ? "font-normal text-neutral-50 border" : "font-medium bg-neutral-50 text-black"} flex flex-row rounded py-0.5 px-2`} onClick={() => setConfirmedTab(false)}>
                            <p className={"pt-[1px]"}>Receivable Transactions</p>
                            <p className="font-mono">&nbsp;</p>
                            {receivableList.length !== null ? <p className="font-mono">({receivableList.length})</p> : <SkeletonText2rem />}
                        </button>
                    </div>

                    <div className="flex flex-col min-w-0 space-y-2">
                        {confirmedTab ?
                            confirmedList.map((blockPair: CustomBlockPair, index) => (
                                <>
                                    <BlockCard
                                        key={blockPair.block1.hash}
                                        blockPair={blockPair}
                                        // if second to last visible, to load next blocks in advanced
                                        isLast={index === confirmedList.length - 2}
                                        newHead={() => setHead(confirmedList[confirmedList.length - 1].block1.hash)}
                                    />
                                    {/*<div className={'absolute w-[41.25rem] h-[7.5rem] min-w-0 bg-neutral-950 -z-10'}>*/}
                                    {/*    e*/}
                                    {/*</div>*/}
                                </>
                            )) :
                            receivableList.map((blockPair: CustomBlockPair, index) => (
                                <BlockCard
                                    key={blockPair.block1.hash}
                                    blockPair={blockPair}
                                />
                            ))
                        }
                    </div>
                </> :
                <>
                    <div className="flex flex-row justify-between">
                        <p className="text-lg font-medium">Recently Confirmed Transactions</p>
                    </div>
                    <div className="min-w-0 flex flex-col space-y-2">
                        {confirmedList.map((blockPair: CustomBlockPair, index) => (
                            <BlockCard
                                key={blockPair.block1.hash}
                                blockPair={blockPair}
                            />
                        ))}
                    </div>
                </>
            }
            {confirmedList.length === 0 ? <SkeletonBlockPair /> : null}
        </div>
    )
}