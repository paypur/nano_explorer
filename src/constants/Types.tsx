export type CustomBlock = {
    amount: string
    type: string
    account: string
    accountLink: string
    hash: string
    timestamp: string
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
            // non standard
            account_link?: string
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
    account: string
    amount: string
    local_timestamp: string
    height: string
    hash: string
    confirmed: string
}