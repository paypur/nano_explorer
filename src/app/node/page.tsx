import AddressAlias from "@/components/address/AddressAlias";
import { NODE_ADDRESS } from "@/constants/Constants";
import { getNodeTelemetry } from "@/functions/RPCs";

export default async function Node(){

    const tem = await getNodeTelemetry()

    return(
        <div className="w-full min-w-0 my-8 px-4">
            <p className='text-lg font-medium'>Node Telemetry</p>

            <p className="text-gray-400">Address</p>
            <AddressAlias nanoAddress={NODE_ADDRESS}/>

            <p className="text-gray-400">Node ID</p>
            <p>{tem.node_id}</p>
            
            <p>Version {tem.major_version}.{tem.minor_version}</p>
            <p className="text-gray-400">Block Count</p>
            <p>{tem.block_count}</p>
            <p className="text-gray-400">Cemented Count</p>
            <p>{tem.cemented_count}</p>
            <p className="text-gray-400">Unchecked Count</p>
            <p>{tem.unchecked_count}</p>

            <p className="text-gray-400">Peers</p>
            <p>{tem.peer_count}</p>


        </div>
    )

}