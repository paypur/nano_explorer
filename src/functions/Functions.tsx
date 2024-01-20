import { CustomBlockPair } from "@/constants/Types"

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