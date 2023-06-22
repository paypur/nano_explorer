import AddressQrCode from './AddressQrCode'

import { MdSmartphone } from 'react-icons/md'
import RepresentativeLabel from './RepresentativeLabel'

export default function AddressCard(props: { nanoAddress: string, balance: string, representative: string }) {
    return (
        <div className="w-full min-w-0 flex flex-row justify-between my-8 py-2 px-4 border border-sky-700 rounded">
            <div className='flex flex-col min-w-0 mr-4'>
                <p className='font-sans text-slate-300 truncate'>Address</p>
                <p className='font-mono truncate'>{props.nanoAddress}</p>
                <p className='font-sans text-slate-300 truncate'>Balance</p>
                <p className='font-mono truncate'>Ӿ{props.balance}</p>
                <p className='font-sans text-slate-300 truncate'>Representative</p>
                {/* @ts-expect-error Server Component */}
                <RepresentativeLabel nanoAddress={props.representative} />
            </div>
            <div className='flex flex-row items-center'>
                <div className='mr-4'>
                    <p className='font-sans text-slate-50'>Address<br />QR code</p>
                    <div className='flex flex-row justify-center'>
                        <MdSmartphone className='text-slate-50 pt-2' size="2rem" />
                    </div>
                </div>
                <AddressQrCode nanoAddress={props.nanoAddress} />
            </div>
        </div>
    )
}