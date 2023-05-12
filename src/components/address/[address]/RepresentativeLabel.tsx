import got from "got"
import { tools } from "nanocurrency-web"

const node = "http://98.35.209.116:7076"

export default async function RepresentativeLabel(props) {
    if (await isRepresentative(props.nanoAddress)) {
        const votingWeight = await getVotingWeight(props.nanoAddress)
        if (await isPrincipalRepresentative(props.nanoAddress, votingWeight)) {
            return (
                <div className="py-2 px-4 border rounded border-sky-700">
                    <p className="text-2xl">Principal Representative</p>
                    <p>Voting Weight: Ӿ{parseFloat(tools.convert(votingWeight, 'RAW', 'NANO')).toFixed(6)}</p>
                </div>
            )
        } else {
            return (
                <div className="py-2 px-4 border rounded border-sky-700">
                    <p className="text-2xl">Representative</p>
                    <p>Voting Weight:  Ӿ{parseFloat(tools.convert(votingWeight, 'RAW', 'NANO')).toFixed(6)}</p>
                </div>
            )
        }
    } else {
        return null
    }
}

async function isRepresentative(nanoAddress: string) {
    const result = await got.post(node, {
        json: {
            "action": "representatives_online",
            "accounts": [nanoAddress]
        }
          
    }).json()

    return result.representatives[0] === nanoAddress
}

async function isPrincipalRepresentative(nanoAddress: string, votingWeight: number) {
    const result = await got.post(node, {
        json: {  
            "action": "confirmation_quorum"      
        }
          
    }).json()

    return votingWeight > result.online_stake_total / 1000

}

async function getVotingWeight(nanoAddress: string) {
    const result = await got.post(node, {
        json: {
            "action": "account_weight",
            "account": nanoAddress
        }
    }).json()

    return result.weight
}