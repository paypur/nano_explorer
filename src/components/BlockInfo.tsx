"use client"

import { AccountHistoryBlock, CustomBlockPair, WSBlock } from "@/constants/Types"
import { AHBlockToCustomBlock, WSBlockToCustomBlock, pushBlock, pushBlocks, unshiftBlock } from "@/functions/Functions"
import { getAccountBlockCount, getAccountHistory, getAccountHistoryNext } from "@/functions/RPCs"
import { useEffect, useState } from "react"
import BlockCardList from "./BlockCardList"
import { WSC } from "@/constants/Socket"
import { getBlockPairData } from "@/functions/ServerFunctions"
import SkeletonText from "./skeletons/SkeletonText"
import SkeletonBlockPair from "./skeletons/SkeletonBlockPair"

export default function BlockInfo(props: { nanoAddress: string, MAX_BLOCKS: number, subscription: any }) {

    const [confirmedList, setConfirmedList] = useState<CustomBlockPair[]>([])
    const [confirmedCount, setConfirmedCount] = useState("")

    const [receivableList, setReceivableList] = useState<CustomBlockPair[]>([])
    const [receivableCount, setReceivableCount] = useState("")

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
                pushBlocks(confirmedList, setConfirmedList, blockPairArray, props.MAX_BLOCKS)
            }

            const getConfirmedCount = async () => {
                setConfirmedCount(await getAccountBlockCount(props.nanoAddress))
            }

            getConfirmed()
            getConfirmedCount()
        }

        WSC.onopen = () => {
            WSC.send(JSON.stringify(props.subscription))
        }
        // super ugly
        WSC.onmessage = async (msg: any) => {
            let data: WSBlock = JSON.parse(msg.data)
            if (data.topic === "confirmation" && confirmedList.filter((e: CustomBlockPair) => e.block1.hash === data.message.hash).length === 0) {
                if (props.nanoAddress === "" || data.message.account === props.nanoAddress) {
                    unshiftBlock(confirmedList, setConfirmedList, await getBlockPairData(WSBlockToCustomBlock(data)), props.MAX_BLOCKS)
                }
            }
        }
    }, [])

    useEffect(() => {
        const getNextBlock = async () => {
            if (head !== "" && confirmedList.length < parseInt(confirmedCount)) {
                pushBlock(confirmedList, setConfirmedList, await getBlockPairData(AHBlockToCustomBlock(await getAccountHistoryNext(props.nanoAddress, head), props.nanoAddress)), props.MAX_BLOCKS)
            }
        }
        getNextBlock()
    }, [head])


    return (
        <div className="my-8 w-full min-w-0 h-fit flex flex-col">
            <div className="text-lg font-medium flex flex-row py-2 px-4">
                <p className="">{props.nanoAddress !== "" ? "New Confirmed Transactions" : "Confirmed Transactions"}</p>
                <p className="font-mono">&nbsp;</p>
                {props.nanoAddress !== "" ?
                    confirmedCount !== "" ?
                        <p className="font-mono">({confirmedCount})</p> :
                        <SkeletonText /> :
                    null}
            </div>
            {props.nanoAddress !== "" ?
                confirmedList.length !== 0 ?
                    <BlockCardList
                        blockList={confirmedList}
                        blockHeight={confirmedCount}
                        newHead={() => setHead(confirmedList[confirmedList.length - 1].block1.hash)}
                    />
                    : <SkeletonBlockPair />
                : <BlockCardList
                    blockList={confirmedList}
                />}
        </div>
    )
}