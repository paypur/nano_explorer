import { getDelegatorsCount } from "@/functions/RPCs"

export default async function RepresentativeDelegators(props: {nanoAddress: string}) {
    
    let delegatorCount = await getDelegatorsCount(props.nanoAddress)
    
    return (
        <p className="font-mono font-medium text-white">{delegatorCount}</p>
    )
}