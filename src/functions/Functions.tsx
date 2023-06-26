import { AccountHistoryBlock, CustomBlock, RPCBlock, WSBlock } from "@/constants/Types"
import { getBlockAccount } from "./RPCs"

export const WSBlockTOCustomBlock = async (block: WSBlock) => {
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

export const AccountHistoryBlockToCustomBlock = (block: AccountHistoryBlock, nanoAddress: string) => {
    return ({
        amount: block.amount,
        type: block.subtype,
        account: nanoAddress,
        accountLink: block.account,
        hash: block.hash,
        timestamp: (parseInt(block.local_timestamp) * 1000).toString()
    } as CustomBlock)
}

export const RPCBlockTOCustomBlock = async (blockHash: string, block: RPCBlock) => {
    return ({
        amount: block.amount,
        type: block.subtype,
        account: block.block_account,
        accountLink: block.subtype === "send" ? block.contents.link_as_account : await getBlockAccount(block.contents.link),
        hash: blockHash,
        timestamp: (parseInt(block.local_timestamp) * 1000).toString()
    })
}

export const pushBlock = (blockList: any, blockFunction: any, block: CustomBlock, MAX_BLOCKS: number) => {
    blockFunction((prev: any) => [...prev, block])
    if (blockList.length > MAX_BLOCKS) {
        blockFunction(blockList.slice(0, -1))
    }
}

export const unshiftBlock = (blockList: any, blockFunction: any, block: CustomBlock, MAX_BLOCKS: number) => {
    blockFunction((prev: any) => [block, ...prev])
    if (blockList.length > MAX_BLOCKS) {
        blockFunction(blockList.slice(0, -1))
    }
}