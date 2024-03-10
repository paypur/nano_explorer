"use server"

import { NanoTONames } from "@/constants/Types";

import fs from "fs";

const file: NanoTONames[] = JSON.parse(fs.readFileSync("./src/serverFunctions/aliases.json", "utf8"))

export async function getAlias(nanoAddress: string) {
    const query = file.find((e) => e.address === nanoAddress)
    return query !== undefined ? query.name : null
}