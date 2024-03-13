"use server"

import fs from "fs";

const file = JSON.parse(fs.readFileSync("./src/serverFunctions/nodeMapping.json", "utf8"))

export async function addressToID(nanoAddress: string): Promise<string> {
    return file[nanoAddress]
}