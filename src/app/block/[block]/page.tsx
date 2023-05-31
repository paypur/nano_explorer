import got from 'got'
import Link from 'next/link'
import { headers } from 'next/headers';
import TransactionCard from '@/components/TransactionCard';

const node = "http://98.35.209.116:7076"

export default async function BlockPage(){

    // https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664
    const headersList = headers();
    // read the custom x-url header
    const header_url = headersList.get('x-url') || "";

    const blockHash = header_url.slice(-64)

    const blockJson = await getBlock(blockHash)
    let modifiedblockJson = JSON.parse(JSON.stringify(blockJson));
    modifiedblockJson["hash"] = blockHash

    return (
        <div>
            <div className='my-6 border rounded border-sky-700'>
                <TransactionCard transaction={modifiedblockJson}></TransactionCard>
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
    const result = await got.post(node, {
        json: {  
            "action": "block_info",
            "json_block": "true",
            "hash": blockHash
        }
    }).json()

    return result
}