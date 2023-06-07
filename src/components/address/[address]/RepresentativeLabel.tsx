import { NODE } from "@/constants/NodeAddress"
import { tools } from "nanocurrency-web"

export default async function RepresentativeLabel(props: {nanoAddress: string}) {
    if (await isRepresentative(props.nanoAddress)) {
        const votingWeight = await getVotingWeight(props.nanoAddress)
        return (
            <div className="py-2 px-4 border rounded border-sky-700">
                <p className="">{await isPrincipalRepresentative(props.nanoAddress, votingWeight) ? "Principal Representative": "Representative"}</p>
                <p>Voting Weight:  Ӿ{parseFloat(tools.convert(votingWeight, 'RAW', 'NANO')).toFixed(6)}</p>
            </div>
        )
    } else {
        return null
    }
}

async function isRepresentative(nanoAddress: string) {
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

async function isPrincipalRepresentative(nanoAddress: string, votingWeight: number) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({  
            "action": "confirmation_quorum"      
        })
    })
    const data = await result.json()

    return votingWeight > (data.online_stake_total / 1000)

}

async function getVotingWeight(nanoAddress: string) {
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