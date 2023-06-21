import { headers } from 'next/headers';
import BlockCard from '@/components/BlockCard';
import { CustomBlock, RPCBlock } from '@/constants/Types';
import { getBlockAccount, getBlockInfo } from '@/functions/RPCs';

export default async function BlockPage() {

    // https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664
    const headersList = headers();
    // read the custom x-url header
    const header_url = headersList.get('x-url') || "";

    const blockHash = header_url.slice(-64)
    const blockJson: RPCBlock = await getBlockInfo(blockHash)

    const customBlock: CustomBlock = {
        amount: blockJson.amount,
        type: blockJson.subtype,
        account: blockJson.block_account,
        accountLink: blockJson.subtype === "send" ? blockJson.contents.link_as_account : await getBlockAccount(blockJson.contents.link),
        hash: blockHash,
        timestamp: (parseInt(blockJson.local_timestamp) * 1000).toString()
    }

    return (
        <div className='w-full min-w-0'>
            <div className='border rounded border-sky-700 my-8'>
                <BlockCard block={customBlock}/>
            </div>
            <div className='flex flex-col py-2 px-4 my-8 border rounded border-sky-700'>
                <p>Raw JSON for block<span className='font-mono'>&nbsp;{blockHash}</span></p>
                <pre className='text-sm'><code>{JSON.stringify(blockJson, null, 4)}</code></pre>
            </div>
        </div>
    )
}