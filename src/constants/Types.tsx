export type CustomBlock = {
    amount: string
    type: string
    account: string
    alias: string
    hash: string
    timestamp: string
    link: string
    account_link: string
}

export type CustomBlockPair = {
    block1: CustomBlock
    block2?: CustomBlock
}

export type WSBlock = {
    topic: string
    time: string
    message: {
        account: string
        amount: string
        hash: string
        confirmation_type: string
        block: {
            type: string
            account: string
            previous: string
            representative: string
            balance: string
            link: string
            link_as_account: string
            signature: string
            work: string
            subtype: string
        }
    }
}

export type RPCBlock = {
    block_account: string
    amount: string
    balance: string
    height: string
    local_timestamp: string
    successor: string
    confirmed: string
    contents: {
        type: string
        account: string
        previous: string
        representative: string
        balance: string
        link: string
        link_as_account: string
        signature: string
        work: string
    },
    subtype: string
}

export type AccountHistoryBlock = {
    type: string
    representative: string
    link: string
    balance: string
    previous: string
    subtype: string
    account: string
    amount: string
    local_timestamp: string
    height: string
    hash: string
    confirmed: string
    work: string
    signature: string
}

type WeightData = {
    weight: string
    time: number
}

export type ChartData = {
    fill: boolean
    label: string
    data: any[]
}

export type NanoTOResponse = {
    names: NanoTONames[]
}

export type NanoTONames = {
    name: string
    address: string
    created: string
    expires: string
    created_unix: string
    expires_unix: string
}