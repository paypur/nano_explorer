"use server"

import fs from "fs";

const file = JSON.parse(fs.readFileSync("./src/server_functions/nodeMapping.json", "utf8"))

export async function addressToID(nanoAddress: string): Promise<string> {
    return file[nanoAddress]
}