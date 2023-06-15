import { NODE } from "@/constants/NodeAddress"
import { tools } from "nanocurrency-web"

// https://docs.nano.org/commands/rpc-protocol/

export async function getBlockInfo(blockHash: string) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({  
            "action": "block_info",
            "json_block": "true",
            "hash": blockHash
        })
    })
    const data = await result.json()
    return data
}

export async function getBlockAccount(hash: string) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({
            "action": "block_account",
            "hash": hash   
        })
    })
    const data = await result.json()
    return data.account
}

export async function getAccountBalance(nanoAddress: string) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({
            "action": "account_balance",
            "account": nanoAddress
        })
    })
    const data = await result.json()

    return parseFloat(tools.convert(data.balance, 'RAW', 'NANO')).toFixed(6)
}

export async function getAccountRepresentative(nanoAddress: string) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({
            "action": "account_representative",
            "account": nanoAddress
        })   
    })
    const data = await result.json()

    return data.representative
}
           

export async function getAccountHistory(nanoAddress: string) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({
            "action": "account_history",
            "account": nanoAddress,
            "count": "10",
            "raw": "true"
        })
    })
    const data = await result.json()
    return data.history
}

export async function getAccountHistoryNext(nanoAddress: string, head: string) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({
            "action": "account_history",
            "account": nanoAddress,
            "count": "1",
            "raw": "true",
            "head": head,
            "offset": "1"
        })
    })
    const data = await result.json()
    return data.history[0]
}

export async function isRepresentative(nanoAddress: string) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({
            "action": "representatives_online",
            "accounts": [nanoAddress]
        })
    })
    const data = await result.json()
    return data.representatives[0] === nanoAddress
}

export async function isPrincipalRepresentative(nanoAddress: string, votingWeight: number) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({  
            "action": "confirmation_quorum"      
        })
    })
    const data = await result.json()
    return votingWeight > (data.online_stake_total / 1000)

}

export async function getAccountVWeight(nanoAddress: string) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({
            "action": "account_weight",
            "account": nanoAddress
        })
    })
    const data = await result.json()
    return data.weight
}

export async function getDelegatorsCount(nanoAddress: string) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({
            "action": "delegators_count",
            "account": nanoAddress
        })
    })
    const data = await result.json()
    return data.count
}

export async function getAccountBlockCount(nanoAddress: string) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({
            "action": "account_block_count",
            "account": nanoAddress
        })
    })
    const data = await result.json()
    return data.block_count
}