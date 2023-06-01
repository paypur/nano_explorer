import { tools } from "nanocurrency-web"

const node = "http://98.35.209.116:7076"

export default async function RepresentativeLabel(props) {
    if (await isRepresentative(props.nanoAddress)) {
        const votingWeight = await getVotingWeight(props.nanoAddress)
        let label = ""
        if (await isPrincipalRepresentative(props.nanoAddress, votingWeight)) {
            label = "Principal Representative"
        } else {
            label = "Representative"
        }
        return (
            <div className="py-2 px-4 border rounded border-sky-700">
                <p className="text-2xl">{label}</p>
                <p>Voting Weight:  Ӿ{parseFloat(tools.convert(votingWeight, 'RAW', 'NANO')).toFixed(6)}</p>
            </div>
        )
    } else {
        return null
    }
}

async function isRepresentative(nanoAddress: string) {
    const result = await fetch(node, {
        method: "POST",
        body: JSON.stringify({
            "action": "representatives_online",
            "accounts": [nanoAddress]
        })
    })
    const data = await result.json()

    return data.representatives[0] === nanoAddress
}

async function isPrincipalRepresentative(nanoAddress: string, votingWeight: number) {
    const result = await fetch(node, {
        method: "POST",
        body: JSON.stringify({  
            "action": "confirmation_quorum"      
        })
    })
    const data = await result.json()

    return votingWeight > (data.online_stake_total / 1000)

}

async function getVotingWeight(nanoAddress: string) {
    const result = await fetch(node, {
        method: "POST",
        body: JSON.stringify({
            "action": "account_weight",
            "account": nanoAddress
        })
    })
    const data = await result.json()

    return data.weight
}