import Link from 'next/link'

export default function AddressCard(props: {nanoAddress: string, balance: string, representative: string}) {
    return (
        <div className="flex flex-col my-8 py-2 px-4 border rounded border-sky-700">
            <p className='text-2xl'>{props.nanoAddress}</p>
            <p>Balance: Ӿ{props.balance}</p>
            <p>Representative: <Link className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={"/address/" + props.representative}>{props.representative}</Link> </p>
        </div>
    ) 
}