import { headers } from 'next/headers';
import { NODE } from '@/constants/NodeAddress';
import BlockCard from '@/components/block/[block]/BlockCard';
import { CustomBlock, RPCBlock } from '@/constants/Types';

export default async function BlockPage(){

    // https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664
    const headersList = headers();
    // read the custom x-url header
    const header_url = headersList.get('x-url') || "";

    const blockHash = header_url.slice(-64)

    const blockJson: RPCBlock = await getBlock(blockHash)

    const customBlock: CustomBlock = {
        amount: blockJson.amount,
        type: blockJson.subtype,
        account: blockJson.block_account,
        accountLink: blockJson.subtype === "send" ? blockJson.contents.link_as_account: await getBlockAddress(blockJson.contents.link),
        hash: blockHash,
        timestamp: blockJson.local_timestamp
    } 

    return (
        <div>
            <div className='my-6 border rounded border-sky-700'>
                <BlockCard block={customBlock}></BlockCard>
            </div>
            <p className='text-1xl py-2'>Raw JSON for block {blockHash}</p>
            <div className='flex flex-col py-2 px-4 border rounded border-sky-700'>
                <pre className='py-2'><code>{JSON.stringify(blockJson, null, 4)}</code></pre>
            </div>
        </div>
    )

}

// https://docs.nano.org/commands/rpc-protocol/

async function getBlock(blockHash: string) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({  
            "action": "block_info",
            "json_block": "true",
            "hash": blockHash
        })
    })
    const data = await result.json()
    return data
}

async function getBlockAddress(hash: string) {
    const result = await fetch(NODE, {
        method: "POST",
        body: JSON.stringify({
            "action": "block_account",
            "hash": hash   
        })
    })
    const data = await result.json()
    return data.account
}