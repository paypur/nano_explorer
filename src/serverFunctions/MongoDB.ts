"use server"

import { ChartData } from "@/constants/Types"
import { MongoClient } from "mongodb"

const username = encodeURIComponent(process.env.MONGODB_USER!)
const password = encodeURIComponent(process.env.MONGODB_PASS!)
const url = process.env.MONGODB_URL!
const authMechanism = "DEFAULT"
const database = "nodes"

export async function getNodeWeightsTop() {

    let dataSet: ChartData[] = []
    
    const client = new MongoClient(`mongodb://${username}:${password}@${url}/?authMechanism=${authMechanism}&authSource=${database}`, { tls: true })

    try {
        await client.connect()
        const db = client.db(database)

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
        return []
    }
    finally {
        client.close()
    }
    
}

export async function getNodeWeightsAdress(nanoAddress: string) {

    let dataSet: ChartData[] = []

    const client = new MongoClient(`mongodb://${username}:${password}@${url}/?authMechanism=${authMechanism}&authSource=${database}`, { tls: true })

    try {
        await client.connect()
        const db = client.db(database)

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
        return []
    }
    finally {
        await client.close()
    }

}