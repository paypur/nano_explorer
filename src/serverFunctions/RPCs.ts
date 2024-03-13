"use server"

import { AccountHistoryBlock, RPCBlock, Telemetry } from "@/constants/Types"

// https://docs.nano.org/commands/rpc-protocol/

export async function getBlockInfo(blockHash: string): Promise<RPCBlock> {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "block_info",
            "json_block": "true",
            "hash": blockHash
        }),
        next: { revalidate: 10 }
    })
    const data = await result.json()
    return data
}

export async function getBlockInfoReceiveHash(blockHash: string) {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "blocks_info",
            "json_block": "true",
            "hashes": [blockHash],
            "receive_hash": "true"
        }),
        next: { revalidate: 10 }
    })
    const data = await result.json()
    for (const hash in data.blocks) {
        return data.blocks[hash].receive_hash
    }
}
export async function getBlocksInfo(blockHash: string[]) {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "blocks_info",
            "json_block": "true",
            "hashes": blockHash
        }),
        next: { revalidate: 10 }
    })
    const data = await result.json()
    return data
}


export async function getBlockAccount(hash: string) {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "block_account",
            "hash": hash
        }),
        next: { revalidate: 10 }
    })
    const data = await result.json()
    return data.account
}

export async function getAccountBalance(nanoAddress: string) {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "account_balance",
            "account": nanoAddress
        }),
        next: { revalidate: 10 }
    })
    const data = await result.json()
    return data.balance
}

export async function getAccountRepresentative(nanoAddress: string) {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "account_representative",
            "account": nanoAddress
        }),
        next: { revalidate: 10 }
    })
    const data = await result.json()
    // TODO: nano_3k81yfit51sncp8n3p557i6edb3mrq58b7ytz7r1nbf1dex11redam3d4wbq causes explosion
    return data.representative.toString()
}


export async function getAccountHistory(nanoAddress: string): Promise<AccountHistoryBlock[]> {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "account_history",
            "account": nanoAddress,
            "raw": "true",
            "count": "5"
        }),
        next: { revalidate: 10 }
    })
    const data = await result.json()
    return data.history
}

export async function getAccountHistoryNext(nanoAddress: string, head: string): Promise<AccountHistoryBlock> {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "account_history",
            "account": nanoAddress,
            "raw": "true",
            "count": "1",
            "offset": "1",
            "head": head
        }),
        next: { revalidate: 10 }
    })
    const data = await result.json()
    return data.history[0]
}

export async function getRepresentativesOnline() {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "representatives_online",
            "weight": "true"
        }),
        next: { revalidate: 10 }
    })
    const data = await result.json()
    return data.representatives
}

export async function getRepresentativesOnlineByAddress(nanoAddress: string) {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "representatives_online",
            "accounts": [nanoAddress]
        }),
        next: { revalidate: 10 }
    })
    const data = await result.json()
    return data.representatives
}

export async function getRepresentatives() {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "representatives"
        }),
        next: { revalidate: 10 }
    })
    const data = await result.json()
    return data.representatives
}

export async function getAccountWeight(nanoAddress: string) {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "account_weight",
            "account": nanoAddress
        }),
        next: { revalidate: 10 }
    })
    const data = await result.json()
    return data.weight
}

export async function getConfirmationQuorum() {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "confirmation_quorum"
        }),
        next: { revalidate: 10 }
    })
    const data = await result.json()
    return data.online_stake_total
}

export async function getDelegatorsCount(nanoAddress: string) {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "delegators_count",
            "account": nanoAddress
        }),
        next: { revalidate: 3600 }
    })
    try {
        const data = await result.json()
        return data.count
    }
    catch {
        console.error(`getDelegatorsCount(${nanoAddress}) timed out`)
        return undefined
    }
}

export async function getAccountBlockCount(nanoAddress: string) {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "account_block_count",
            "account": nanoAddress
        }),
        next: { revalidate: 10 }
    })
    const data = await result.json()
    return data.block_count
}

export async function getAccountReceivable(nanoAddress: string) {
    // explodes for large queries
    // limit of 2MB
    // cap to 100 for now
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "accounts_receivable",
            "accounts": [nanoAddress],
            "count": "100"
        }),
        next: { revalidate: 10 }
    })
    const data = await result.json()
    return data.blocks !== "" ? data.blocks[nanoAddress] : []
}

export async function getNodeTelemetryLocal(): Promise<Telemetry> {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "telemetry",
            "raw": "true",
            "address": "127.0.0.1",
            "port": "7075"
        }),
        next: { revalidate: 600 }
    })
    const data = await result.json()
    return data
}

export async function getNodeTelemetryNodeID(nodeIDddress: string): Promise<Telemetry> {
    const result = await fetch(process.env.NODE_RPC!, {
        method: "POST",
        body: JSON.stringify({
            "action": "telemetry",
            "raw": "true",
            "address": nodeIDddress,
            "port": "7075"
        }),
        next: { revalidate: 600 }
    })
    const data = await result.json()
    return data
}