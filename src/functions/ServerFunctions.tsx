"use server"

export async function getAlias( nanoAddress: string ) {
    const result = await fetch(`https://nano.to/.well-known/nano-currency.json?names=${nanoAddress}`, { next: { revalidate: 3600 } })
    return await result.json()
}

export async function getNanoUSD() {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=nano&vs_currencies=usd", { next: { revalidate: 600 } })
    const data = await response.json()
    return data.nano.usd
}