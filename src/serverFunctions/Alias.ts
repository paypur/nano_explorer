"use server"

import { NanoTONames } from "@/constants/Types";

import fs from "fs";

const fileSelf: NanoTONames[] = JSON.parse(fs.readFileSync("./src/serverFunctions/aliases_self.json", "utf8"))
const file: NanoTONames[] = JSON.parse(fs.readFileSync("./src/serverFunctions/aliases.json", "utf8"))

export async function getAlias(nanoAddress: string) {
    let query = fileSelf.find((e) => e.address === nanoAddress)
    
    if (query === undefined) {
        query = file.find((e) => e.address === nanoAddress)
    }

    return query !== undefined ? query.name : null
}