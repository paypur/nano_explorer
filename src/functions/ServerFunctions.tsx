"use server"

import { ChartData, CustomBlock, CustomBlockPair } from "@/constants/Types"
import { RPCBlockToCustomBlock } from "./Functions"
import { getBlockInfoReceiveHash, getBlockInfo } from "./RPCs"

import { MongoClient } from "mongodb"

export async function getAlias(nanoAddress: string) {
    const result = await fetch(`https://nano.to/.well-known/nano-currency.json?names=${nanoAddress}`, { next: { revalidate: 3600 } })
    return await result.json()
}

export async function getNanoUSD() {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=nano&vs_currencies=usd", { next: { revalidate: 600 } })
    const data = await response.json()
    return data.nano.usd
}

export async function getBlockPairData(block: CustomBlock) {
    let blockPair: CustomBlockPair = { block1: block }
    if (blockPair.block1.type === "send") {
        // guaranteed to be missing for websockets
        let receiveHash = await getBlockInfoReceiveHash(block.hash)
        if (receiveHash !== "0000000000000000000000000000000000000000000000000000000000000000") {
            blockPair["block2"] = RPCBlockToCustomBlock(await getBlockInfo(receiveHash), receiveHash)
        }
        else {
            blockPair["block2"] = {
                account: block.account_link
            } as CustomBlock
        }
    }
    else if (blockPair.block1.type === "receive") {
        blockPair["block2"] = RPCBlockToCustomBlock(await getBlockInfo(block.link), block.link)
    }
    return blockPair
}

export async function getNodeWeights() {

    // setup db connection
    const client = new MongoClient("mongodb://127.0.0.1:27017");
    await client.connect();
    const dbName = "test"
    const db = client.db(dbName);

    let dataSet: ChartData[] = []

    let collections = await db.listCollections().toArray()

    for (const collectionOBJ of collections) {
        const collection = db.collection(collectionOBJ.name)
        const docs = await collection.find({}).project({ _id: 0 }).sort({ time: 1 }).toArray()
        dataSet.push({
            fill: true,
            label: collectionOBJ.name,
            data: docs,
        })
    }

    dataSet.sort((a, b) => b.data[0].weight - a.data[0].weight)

    return dataSet.slice(0, 10)
}