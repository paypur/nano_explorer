import { NODE_ADDRESS } from "@/constants/Constants";
import FormatLink from "@/components/FormatLink";
import RepresentativeDelegators from "@/components/representative/RepresentativeDelegators";
import RepresentativeWeight from "@/components/representative/RepresentativeWeight";
import { SkeletonText40rem, SkeletonText4rem } from "@/components/skeletons/SkeletonText";
import { getNodeTelemetryLocal } from "@/serverFunctions/RPCs";

import { Suspense } from "react";
import Link from "next/link";
import RepresentativeStatus from "@/components/representative/RepresentativeStatus";

export default async function Node() {

    const tem = await getNodeTelemetryLocal()

    /*
    {
        block_count: '206947073',
        cemented_count: '206947073',
        unchecked_count: '157',
        account_count: '37085419',
        bandwidth_cap: '67108864',
        peer_count: '176',
        protocol_version: '21',
        uptime: '7209359',
        genesis_block: '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948',
        major_version: '27',
        minor_version: '1',
        patch_version: '0',
        pre_release_version: '0',
        maker: '0',
        timestamp: '1741505289003',
        active_difficulty: 'fffffff800000000',
        node_id: 'node_1ub3awctg89qmd898ajxw4eee4gsu8nugrs3593bsuk3cyccgoea43wuuhwc',
        signature: '903D20C76C6AC1A05E8C62830BA6BAE622F45D9E4E9CCBEC61B4F145237F65AF18398B2F30D6C46AB33EEE0B478D03033691990B9FB1BCCC42185FBE75AE0D04'
    }
     */


    const hardware = {
        cpu: "Intel i5-8400",
        ram: "Gskill 2x8GB DDR4-3000",
        disk: "Samsung 850 Evo SSD",
        bandwidth: `${tem.bandwidth_cap} B/s`
    }

    return (
        <div className="min-w-0 my-8 px-4 space-y-4">
            <div>
                <div className={"flex flex-row items-center space-x-4"}>
                    <p className='text-2xl font-medium'>paypur&#39;s Node</p>
                    {/* @ts-expect-error Server Component */}
                    <RepresentativeStatus nanoAddress={NODE_ADDRESS}/>
                </div>

                <Link className="flex items-center max-w-fit text-lg font-mono truncate select-all hover:underline " href={`/address/` + NODE_ADDRESS}>
                    <p>{NODE_ADDRESS.substring(0,5)}</p>
                    <p className={"text-blue-400"}>{NODE_ADDRESS.substring(5,13)}</p>
                    <p>{NODE_ADDRESS.substring(13,59)}</p>
                    <p className={"text-yellow-400"}>{NODE_ADDRESS.substring(57)}</p>
                </Link>
            </div>

            <div>
                <p className='text-lg font-medium'>Hardware</p>
                <p>CPU: {hardware.cpu}</p>
                <p>RAM: {hardware.ram}</p>
                <p>Storage: {hardware.disk}</p>
                <p>Bandwidth: {hardware.bandwidth}</p>
            </div>

            <div>
                <p className='text-lg font-medium'>Node Info</p>

                <p className="text-gray-400">Node ID</p>
                <p className="font-mono truncate select-all">{tem.node_id}</p>
                <p className="text-gray-400">Node Version</p>
                <p>{tem.major_version}.{tem.minor_version}</p>
                <p className="text-gray-400">Protocol</p>
                <p>{tem.protocol_version}</p>
                <p className="text-gray-400">Seconds of uptime</p>
                <p>{tem.uptime}</p>
            </div>

            <div>
                <p className='text-lg font-medium'>Block Info</p>
                
                <p className="text-gray-400">Block Count</p>
                <p>{tem.block_count}</p>
                <p className="text-gray-400">Cemented Count</p>
                <p>{tem.cemented_count}</p>
                <p className="text-gray-400">Unchecked Count</p>
                <p>{tem.unchecked_count}</p>

            </div>

            <div>
                <p className='text-lg font-medium'>Network Info</p>

                <p className="text-gray-400">Peers</p>
                <p>{tem.peer_count}</p>
                <p className="text-gray-400">Genesis Block</p>
                <FormatLink path={tem.genesis_block} type={"block"} />
            </div>

            <div>
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
            </div>
        </div>
    )

}