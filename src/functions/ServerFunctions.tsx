"use server"

import { ChartData } from "@/constants/Types"
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

export async function getNodeWeights() {

    const client = new MongoClient("mongodb://127.0.0.1:27017");
    
    async function main() {
        let dataSet: ChartData[] = []
        
        await client.connect();

        const dbName = "test"
        const db = client.db(dbName);
        
        let collections = await db.listCollections().toArray()
        
        for (const collectionOBJ of collections) {
            const collection = db.collection(collectionOBJ.name)
            const docs = await collection.find({}).project({_id:0}).sort({weight:-1}).toArray()
            dataSet.push({
                fill: true,
                label: collectionOBJ.name,
                data: docs,
            })
        }

        dataSet.sort((a,b) => b.data[0].weight - a.data[0].weight)

        return dataSet.slice(0,100)
    }

    return(await main()
        .catch(console.error)
        .finally(() => setTimeout(() => { client.close() }, 1000)))
}