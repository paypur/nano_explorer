"use server"

import { AccountHistoryBlock, ChartData, CustomBlock, CustomBlockPair, NanoTONames, NanoTOResponse, RPCBlock, WSBlock } from "@/constants/Types"
import { getBlockInfoReceiveHash, getBlockInfo, getAccountHistory, getAccountReceivable, getAccountHistoryNext } from "./RPCs"

import { MongoClient } from "mongodb"

import fs from "fs";

const file: NanoTONames[] = JSON.parse(fs.readFileSync("./src/known.json", "utf8"))

export async function getAlias(nanoAddress: string) {
    const query = file.find((e) => e.address === nanoAddress)
    return query !== undefined ? query.name : null
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

export async function convertWSBlock(data: WSBlock) {
    return await getBlockPairData(await WSBlockToCustomBlock(data))
}

export async function getAHN(nanoAddress: string, head: string) {
    return await getBlockPairData(await AHBlockToCustomBlock(await getAccountHistoryNext(nanoAddress, head), nanoAddress))
}

export async function getTopNodeWeights() {

    const username = encodeURIComponent(process.env.MONGODB_USER!)
    const password = encodeURIComponent(process.env.MONGODB_PASS!)
    const clusterUrl = process.env.MONGODB_URL!
    const authMechanism = "DEFAULT"

    const client = new MongoClient(`mongodb://${username}:${password}@${clusterUrl}/?authMechanism=${authMechanism}`)

    let dataSet: ChartData[] = []

    try {
        await client.connect()
        const db = client.db("nodes")

        // filter interal mongodb stuff
        let collections = await db.listCollections({ name: { $not: { $regex: "^system.*" } } }).toArray()

        for (const collectionOBJ of collections) {
            const documents = await db.collection(collectionOBJ.name).find({})
                .limit(30)
                .project({ _id: 0 }) // exclude id
                .sort({ time: 1 })
                .toArray()

            dataSet.push({
                fill: true,
                label: collectionOBJ.name,
                data: documents
            })
        }
        // sort by weight
        dataSet.sort((a, b) => b.data[0].rawWeight - a.data[0].rawWeight)
        return dataSet.slice(0, 10)
    }
    catch (error) {
        console.error(error)
        return null
    }
    finally {
        client.close()
    }
    
}

export async function getNodeWeightsAdresss(nanoAddress: string) {

    const username = encodeURIComponent(process.env.MONGODB_USER!)
    const password = encodeURIComponent(process.env.MONGODB_PASS!)
    const clusterUrl = process.env.MONGODB_URL!
    const authMechanism = "DEFAULT"

    const client = new MongoClient(`mongodb://${username}:${password}@${clusterUrl}/?authMechanism=${authMechanism}`)

    let dataSet: ChartData[] = []

    try {
        await client.connect()
        const db = client.db("nodes")

        const documents = await db.collection(nanoAddress)
            .find({})
            .limit(30)
            .project({ _id: 0 }) // exclude id
            .sort({ time: 1 })
            .toArray()

        dataSet = [{
            fill: true,
            label: nanoAddress,
            data: documents
        }]
        return dataSet
    }
    catch (error) {
        console.error(error)
        return null
    }
    finally {
        await client.close()
    }

}