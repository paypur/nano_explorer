"use server"

import { getAlias } from "./Alias"
import { getBlockInfoReceiveHash, getBlockInfo, getAccountHistory, getAccountReceivable, getAccountHistoryNext } from "./RPCs"
import { AccountHistoryBlock, CustomBlock, CustomBlockPair, RPCBlock, WSBlock } from "@/constants/Types"

export async function getNanoUSD() {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=nano&vs_currencies=usd", { next: { revalidate: 600 } })
    const data = await response.json()
    return data.nano.usd
}

export async function WSBlockToCustomBlock(block: WSBlock) {
    return ({
        amount: block.message.amount,
        type: block.message.block.subtype,
        account: block.message.account,
        alias: await getAlias(block.message.account),
        hash: block.message.hash,
        timestamp: block.time,
        link: block.message.block.link,
        account_link: block.message.block.link_as_account
    } as CustomBlock)
}

export async function RPCBlockToCustomBlock(block: RPCBlock, blockHash: string) {
    return ({
        amount: block.amount,
        type: block.subtype,
        account: block.block_account,
        alias: await getAlias(block.block_account),
        hash: blockHash,
        timestamp: (parseInt(block.local_timestamp) * 1000).toString(),
        link: block.contents.link,
        account_link: block.contents.link_as_account
    } as CustomBlock)
}

export async function AHBlockToCustomBlock(block: AccountHistoryBlock, nanoAddress: string) {
    return ({
        amount: block.amount,
        type: block.subtype,
        account: nanoAddress,
        alias: await getAlias(nanoAddress),
        hash: block.hash,
        timestamp: (parseInt(block.local_timestamp) * 1000).toString(),
        link: block.link,
        account_link: block.account
    } as CustomBlock)
}

export async function getBlockPairData(block: CustomBlock) {
    let blockPair: CustomBlockPair = { block1: block }
    if (blockPair.block1.type === "send") {
        // guaranteed to be missing for websockets
        let receiveHash = await getBlockInfoReceiveHash(block.hash)
        if (receiveHash !== "0000000000000000000000000000000000000000000000000000000000000000") {
            blockPair["block2"] = await RPCBlockToCustomBlock(await getBlockInfo(receiveHash), receiveHash)
        }
        else {
            blockPair["block2"] = {
                account: block.account_link,
                amount: block.amount,
                alias: await getAlias(block.account_link)
            } as CustomBlock
        }
    }
    else if (blockPair.block1.type === "receive") {
        blockPair["block2"] = await RPCBlockToCustomBlock(await getBlockInfo(block.link), block.link)
    }
    return blockPair
}

export async function getAccountLatestBlocks(nanoAddress: string) {
    let pairArray: CustomBlockPair[] = []
    for (const block of await getAccountHistory(nanoAddress)) {
        pairArray.push(await getBlockPairData(await AHBlockToCustomBlock(block, nanoAddress)))
    }
    return pairArray
}

export async function getAccountReceivableBlocks(nanoAddress: string) {
    let pairArray: CustomBlockPair[] = []
    for (const hash of await getAccountReceivable(nanoAddress)) {
        pairArray.push(await getBlockPairData(await RPCBlockToCustomBlock(await getBlockInfo(hash), hash)))
    }
    return pairArray
}

export async function convertAHN(nanoAddress: string, head: string) {
    return await getBlockPairData(await AHBlockToCustomBlock(await getAccountHistoryNext(nanoAddress, head), nanoAddress))
}

// export async function BlockInfo(blockHash: string) {
//     return await RPCBlockToCustomBlock(await getBlockInfo(blockHash), blockHash)
// }

export async function convertWSBlock(data: WSBlock) {
    return await getBlockPairData(await WSBlockToCustomBlock(data))
}

export async function getAutoComplete(prefix: string): Promise<[string] | undefined> {
    const result = await fetch("http://localhost:8000/api/" + prefix)
    const data = await result.json()

    if (Object.keys(data)[0] == "error") {
        // return data["error"]
    } else if (Object.keys(data)[0] == "data") {
        return data["data"]["addresses"]
    }

    console.error("Invalid Response")
}