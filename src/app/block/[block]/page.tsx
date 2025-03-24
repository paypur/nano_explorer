import { CustomBlock, RPCBlock } from '@/constants/Types'
import BlockHalf from '@/components/block/BlockHalf'
import { getBlockInfo } from '@/server_functions/RPCs'
import { RPCBlockToCustomBlock } from '@/server_functions/ServerFunctions'
import {headers} from "next/headers";

export default async function BlockPage() {

    const headerList = await headers();
    const pathname = headerList.get("x-url");
    // @ts-ignore
    const blockHash = pathname.slice(-64)
    const blockJson: RPCBlock = await getBlockInfo(blockHash)
    const customBlock: CustomBlock = await RPCBlockToCustomBlock(blockJson, blockHash)

    return (
        <div className='w-full min-w-0 my-8 px-4 space-y-2'>
            <p className='text-lg font-medium'>Block Information</p>
            <div>
                <p className='text-gray-400'>Block</p>
                <BlockHalf block={customBlock} />
            </div>
            <div className='overflow-x-scroll'>
                <p className='text-gray-400'>Raw Block JSON</p>
                <pre className='text-sm'><code>{JSON.stringify(blockJson, null, 4)}</code></pre>
            </div>
        </div>
    )
}