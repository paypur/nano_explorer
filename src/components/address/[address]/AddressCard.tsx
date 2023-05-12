import RepresentativeLabel from './RepresentativeLabel'

import got from 'got'
import { tools } from 'nanocurrency-web'
import Link from 'next/link'

const node = "http://98.35.209.116:7076"

export default async function AddressCard(props) {

    const balance = await getBalance(props.nanoAddress)
    const representative = await getRepresentative(props.nanoAddress)

    return (
        <div className="flex flex-col my-8 py-2 px-4 border rounded border-sky-700">
            <RepresentativeLabel nanoAddress={props.nanoAddress}></RepresentativeLabel>
            <p className='text-2xl'>{props.nanoAddress}</p>
            <p>Balance: Ӿ{balance}</p>
            <p>Representative: <Link className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={"/address/" + representative}>{representative}</Link> </p>
        </div>
    ) 
}

// https://docs.nano.org/commands/rpc-protocol/

async function getBalance(nanoAddress: string) {
    const result = await got.post(node, {
        json: {
            "action": "account_balance",
            "account": nanoAddress
        }
    }).json()

    return parseFloat(tools.convert(result.balance, 'RAW', 'NANO')).toFixed(6)
}

async function getRepresentative(nanoAddress: string) {
    const result = await got.post(node, {
        json: {
            "action": "account_representative",
            "account": nanoAddress
          }
          
    }).json()

    return result.representative
}