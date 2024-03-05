import FormatLink from "@/components/FormatLink";
import RepresentativeDelegators from "@/components/representative/RepresentativeDelegators";
import RepresentativeWeight from "@/components/representative/RepresentativeWeight";
import { SkeletonText40rem, SkeletonText4rem } from "@/components/skeletons/SkeletonText";

import { NODE_ADDRESS } from "@/constants/Constants";
import { getNodeTelemetry } from "@/functions/RPCs";
import { Suspense } from "react";

export default async function Node() {

    const tem = await getNodeTelemetry()

    const hardware = {
        cpu: "Intel i5-8400",
        ram: "Gskill 2x8GB DDR4-3000",
        disk: "Samsung 850 Evo SSD",
        bandwidth: `${tem.bandwidth_cap} B/s`
    }

    return (
        <div className="w-full min-w-0 my-8 px-4">


            <p className='text-lg font-medium'>paypur&#39;s Node</p>
            <FormatLink path={NODE_ADDRESS} type={"address"} />

            <p className='text-lg font-medium'>Hardware</p>
            <div>
                <p>CPU: {hardware.cpu}</p>
                <p>RAM: {hardware.ram}</p>
                <p>Storage: {hardware.disk}</p>
                <p>Bandwidth: {hardware.bandwidth}</p>
            </div>

            <p className='text-lg font-medium'>Node Telemetry</p>

            <p className="text-gray-400">Node ID</p>
            <p className="font-mono truncate select-all">{tem.node_id}</p>
            <p className="text-gray-400">Node Version</p>
            <p>V{tem.major_version}.{tem.minor_version}</p>
            <p className="text-gray-400">Protocol</p>
            <p>{tem.protocol_version}</p>

            <div>
                <p className='text-lg font-medium'>Block Info</p>
                <p className="text-gray-400">Block Count</p>
                <p>{tem.block_count}</p>
                <p className="text-gray-400">Cemented Count</p>
                <p>{tem.cemented_count}</p>
                <p className="text-gray-400">Unchecked Count</p>
                <p>{tem.unchecked_count}</p>

            </div>


            <p className="text-gray-400">Peers</p>
            <p>{tem.peer_count}</p>

            <p className="text-gray-400">Genisis Block</p>
            <FormatLink path={tem.genesis_block} type={"block"} />


            <p className='text-lg font-medium'>Representative Info</p>

            <p className='text-gray-400'>Voting Weight</p>
            <Suspense fallback={<>
                <SkeletonText40rem />
                <SkeletonText40rem />
            </>}> {/* @ts-expect-error Server Component */}
                <RepresentativeWeight nanoAddress={NODE_ADDRESS} />
            </Suspense>

            <p className='text-gray-400'>Delegators</p>
            <Suspense fallback={<>
                <SkeletonText4rem />
            </>}> {/* @ts-expect-error Server Component */}
                <RepresentativeDelegators nanoAddress={NODE_ADDRESS} />
            </Suspense>

            <p className="text-gray-400">Seconds of uptime</p>
            <p>{tem.uptime}</p>

        </div>
    )

}