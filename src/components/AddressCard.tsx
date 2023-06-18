import Link from 'next/link'
import AddressQrCode from './AddressQrCode'
import FormatLink from './FormatLink'

export default function AddressCard(props: { nanoAddress: string, balance: string, representative: string }) {
    return (
        <div className="flex flex-row justify-between my-8 py-2 px-4 border border-sky-700 rounded truncate">
            <div className='flex flex-col min-w-0 mr-4'>
            <p className='font-sans text-sm text-slate-200 truncate'>Address</p>
                <p className='font-mono font-normal text-xl text-slate-50 truncate'>{props.nanoAddress}</p>
                <p className='font-sans text-sm text-slate-200 truncate'>Balance</p>
                <p className='font-mono text-lg text-slate-50 truncate'>Ӿ{props.balance}</p>
                <p className='font-sans text-sm truncate'>Representative</p>
                <FormatLink path={props.representative} type="address"/>
            </div>
            <AddressQrCode nanoAddress={props.nanoAddress}/>
        </div>
    )
}