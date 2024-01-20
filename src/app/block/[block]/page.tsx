import { headers } from 'next/headers';
import { CustomBlock, RPCBlock } from '@/constants/Types';
import { getBlockInfo } from '@/functions/RPCs';
import { RPCBlockToCustomBlock } from '@/functions/Functions';
import BlockHalf from '@/components/BlockHalf';

export default async function BlockPage() {

    // https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664
    const headersList = headers();
    // read the custom x-url header
    const header_url = headersList.get('x-url') || "";

    const blockHash = header_url.slice(-64)
    const blockJson: RPCBlock = await getBlockInfo(blockHash)
    const customBlock: CustomBlock = await RPCBlockToCustomBlock(blockJson, blockHash)

    return (
        <div className='w-full min-w-0 my-8 px-4 space-y-2'>
            <div>
                <p className='text-gray-400'>Block</p>
                <BlockHalf block={customBlock} />
            </div>
            <div className='overflow-x-scroll'>
                <p className=' text-gray-400'>Raw JSON</p>
                <pre className='px-4 py-2 border-sky-700 text-sm'><code>{JSON.stringify(blockJson, null, 4)}</code></pre>
            </div>
        </div>
    )
}