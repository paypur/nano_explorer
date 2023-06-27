"use client"

import { AccountHistoryBlock, CustomBlock, WSBlock } from "@/constants/Types"
import { AccountHistoryBlockToCustomBlock, RPCBlockTOCustomBlock, WSBlockTOCustomBlock, pushBlock, unshiftBlock } from "@/functions/Functions"
import { getAccountBlockCount, getAccountHistory, getAccountHistoryNext, getAccountsReceivable, getBlockInfo } from "@/functions/RPCs"
import { useEffect, useState } from "react"
import BlockCardList from "./BlockCardList"
import { WSC } from "@/constants/Socket"

export default function BlockInfo(props: { nanoAddress: string, MAX_BLOCKS: number, subscription: any }) {

    const [receivableList, setReceivableList] = useState<CustomBlock[]>([])
    
    const [confirmedList, setConfirmedList] = useState<CustomBlock[]>([])
    const [confirmedCount, setConfirmedCount] = useState("")

    const [LinkDictionary, setLinkDictionary] = useState<any>({})
    const [head, setHead] = useState("")

    useEffect(() => { 
        const addLink = (key: string, value: string) => {
            setLinkDictionary({ ...LinkDictionary, [key]: value })
        }
        
        const getReceivable = async () => {
            const hashList: string[] = await getAccountsReceivable(props.nanoAddress)
            if (hashList !== undefined) {
                for (const hash of hashList) {
                    const customBlock = await RPCBlockTOCustomBlock(hash, await getBlockInfo(hash))
                    unshiftBlock(receivableList, setReceivableList, customBlock, props.MAX_BLOCKS)
                }
            }
        }    
        
        const getConfirmed = async () => {
            const blocks: AccountHistoryBlock[] = await getAccountHistory(props.nanoAddress)
            for (const block of blocks) {
                // needs to handle change blocks
                const customBlock = AccountHistoryBlockToCustomBlock(block, props.nanoAddress)
                pushBlock(confirmedList, setConfirmedList, customBlock, props.MAX_BLOCKS)
            }
        }

        const getConfirmedCount = async () => {
            setConfirmedCount(await getAccountBlockCount(props.nanoAddress))
        }

        if (props.nanoAddress !== "") {
            getReceivable()
            getConfirmed()
            getConfirmedCount()
        }

        WSC.onopen = () => {
            WSC.send(JSON.stringify(props.subscription))
        }
        // super ugly
        WSC.onmessage = async (msg: any) => {
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
                    unshiftBlock(confirmedList, setConfirmedList, await WSBlockTOCustomBlock(data), props.MAX_BLOCKS)
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
                    unshiftBlock(confirmedList, setConfirmedList, await WSBlockTOCustomBlock(data), props.MAX_BLOCKS)
                } else if (data.message.block.subtype === "send") {
                    // store sender address for later
                    addLink(data.message.hash, data.message.account)
                    unshiftBlock(receivableList, setReceivableList, await WSBlockTOCustomBlock(data), props.MAX_BLOCKS)
                }
            }
        }
    }, [])

    useEffect(() => {
        const getNextBlock = async () => {
            if (head !== "" && confirmedList.length < parseInt(confirmedCount)) {
                // needs to handle change blocks
                const customBlock = AccountHistoryBlockToCustomBlock(await getAccountHistoryNext(props.nanoAddress, head), props.nanoAddress)
                pushBlock(confirmedList, setConfirmedList, customBlock, props.MAX_BLOCKS)
            }
        }
        getNextBlock()
    }, [head])


    // return (
    //     <div className="w-full min-w-0 flex my-8 divide-x rounded border border-sky-700">
    //         <button
    //             className='py-2 px-4 flex-auto border-sky-700 rounded'
    //             onClick={}
    //         >
    //             Confirmed
    //         </button>
    //         <button
    //             className='py-2 px-4 flex-auto border-sky-700'
    //             onClick={}
    //         >
    //             Receivable
    //         </button>
    //     </div>
    // )

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
}