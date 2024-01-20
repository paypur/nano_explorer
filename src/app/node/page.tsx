import AddressAlias from "@/components/address/AddressAlias";
import { NODE_ADDRESS } from "@/constants/Constants";
import { getNodeTelemetry } from "@/functions/RPCs";

export default async function Node(){

    const tem = await getNodeTelemetry()

    return(
        <div className="self-center">
            <p className='text-lg font-medium'>Node Information</p>
            <AddressAlias nanoAddress={NODE_ADDRESS}/>
            
            <p>Version {tem.major_version}.{tem.minor_version}</p>
            <p>{tem.block_count}</p>
            <p>{tem.cemented_count}</p>
            <p>{tem.unchecked_count}</p>
        </div>
    )

}