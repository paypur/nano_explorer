import { getDelegatorsCount } from "@/server_functions/RPCs"

export default async function RepresentativeDelegators(props: {nanoAddress: string}) {
    
    const delegatorCount = await getDelegatorsCount(props.nanoAddress)
    
    return (
        <p className="font-mono font-medium text-white">{delegatorCount}</p>
    )
}