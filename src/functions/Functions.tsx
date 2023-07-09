import { AccountHistoryBlock, CustomBlock, CustomBlockPair, RPCBlock, WSBlock } from "@/constants/Types"

export const WSBlockToCustomBlock = (block: WSBlock) => {
    return ({
        amount: block.message.amount,
        type: block.message.block.subtype,
        account: block.message.account,
        hash: block.message.hash,
        timestamp: block.time,
        link: block.message.block.link,
        account_link: block.message.block.link_as_account
    } as CustomBlock)
}

export const RPCBlockToCustomBlock = (block: RPCBlock, blockHash: string) => {
    return ({
        amount: block.amount,
        type: block.subtype,
        account: block.block_account,
        hash: blockHash,
        timestamp: (parseInt(block.local_timestamp) * 1000).toString(),
        link: block.contents.link,
        account_link: block.contents.link_as_account
    } as CustomBlock)
}

export const AHBlockToCustomBlock = (block: AccountHistoryBlock, nanoAddress: string) => {
    return ({
        amount: block.amount,
        type: block.subtype,
        account: nanoAddress,
        hash: block.hash,
        timestamp: (parseInt(block.local_timestamp) * 1000).toString(),
        link: block.link,
        account_link: block.account
    } as CustomBlock)
}

export const pushBlock = (blockList: any, blockFunction: any, block: CustomBlockPair, MAX_BLOCKS: number) => {
    blockFunction((prev: any) => [...prev, block])
    if (blockList.length > MAX_BLOCKS) {
        blockFunction(blockList.slice(0, -1))
    }
}

export const pushBlocks = (blockList: any, blockFunction: any, block: CustomBlockPair[], MAX_BLOCKS: number) => {
    blockFunction((prev: any) => [...prev, ...block])
    if (blockList.length > MAX_BLOCKS) {
        blockFunction(blockList.slice(0, -1))
    }
}

export const unshiftBlock = (blockList: any, blockFunction: any, block: CustomBlockPair, MAX_BLOCKS: number) => {
    blockFunction((prev: any) => [block, ...prev])
    if (blockList.length > MAX_BLOCKS) {
        blockFunction(blockList.slice(0, -1))
    }
}