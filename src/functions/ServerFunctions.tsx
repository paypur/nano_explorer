"use server"

import { AccountHistoryBlock, ChartData, CustomBlock, CustomBlockPair, NanoTOResponse, RPCBlock, WSBlock } from "@/constants/Types"
import { getBlockInfoReceiveHash, getBlockInfo } from "./RPCs"

import { MongoClient } from "mongodb"

export async function getAlias(nanoAddress: string) {
    const result = await fetch(`https://nano.to/.well-known/nano-currency.json?names=${nanoAddress}`, { next: { revalidate: 3600 } })
    const data: Promise<NanoTOResponse> = await result.json()
    return ((await data).names.length !== 0) ? (await data).names[0]["name"] : null
}

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
                account: block.account_link
            } as CustomBlock
        }
    }
    else if (blockPair.block1.type === "receive") {
        blockPair["block2"] = await RPCBlockToCustomBlock(await getBlockInfo(block.link), block.link)
    }
    return blockPair
}

export async function getNodeWeights() {

    // setup db connection
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    await client.connect();
    const dbName = "nodes"
    const db = client.db(dbName);

    let dataSet: ChartData[] = []

    // filter interal mongodb stuff
    let collections = await db.listCollections({ name: { $not: { $regex: "^system.*" } } }).toArray()

    for (const collectionOBJ of collections) {
        const account = db.collection(collectionOBJ.name)
        
        const documents = await account.find({})
            .limit(30)
            .project({ _id: 0 }) // exclude id
            .sort({ time: 1 })
            .toArray();

        dataSet.push({
            fill: true,
            label: collectionOBJ.name,
            data: documents
        })
    }

    dataSet.sort((a, b) => b.data[0].rawWeight - a.data[0].rawWeight)

    return dataSet.slice(0, 20)
}