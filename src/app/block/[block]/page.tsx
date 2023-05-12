import got from 'got'
import Link from 'next/link'
import { headers } from 'next/headers';

const node = "http://98.35.209.116:7076"

export default async function BlockPage(){

    // no idea how this works
    // took this from https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664
    const headersList = headers();
    // read the custom x-url header
    const header_url = headersList.get('x-url') || "";

    const blockHash = header_url.slice(-64)

    const blockJson = await getBlock(blockHash)

    return (
        <div className='flex flex-col my-6 py-2 px-4 border rounded border-sky-700'>
            <p className='text-2xl py-2'>Raw JSON for block {blockHash}</p>
            <pre className='py-2'><code>{JSON.stringify(blockJson, null, 4)}</code></pre>
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