import AddressQrCode from './AddressQrCode'

import { MdSmartphone } from 'react-icons/md'
import RepresentativeLabel from './RepresentativeLabel'
import { getAccountBalance, getAccountRepresentative } from '@/functions/RPCs'
import AddressAlias from './AddressAlias'

export default async function AddressCard(props: { nanoAddress: string }) {
    const balance = await getAccountBalance(props.nanoAddress)
    const representative = await getAccountRepresentative(props.nanoAddress)

    return (
        <div className="w-full min-w-0 flex flex-row justify-between my-8 py-2 px-4 border border-sky-700 rounded">
            <div className='flex flex-col min-w-0 mr-4'>
                <p className='text-sm text-gray-400'>Account</p>
                <AddressAlias nanoAddress={props.nanoAddress}/>
                <p className='text-sm text-gray-400'>Balance</p>
                <p className='font-mono truncate'>Ӿ{balance}</p>
                <p className='text-sm text-gray-400'>Representative</p>
                {/* @ts-expect-error Server Component */}
                <RepresentativeLabel nanoAddress={representative} />
            </div>
            <div className='flex flex-row items-center'>
                <div className='flex flex-col items-center mr-4'>
                    <p className='font-sans text-slate-50'>Address<br />QR code</p>
                    <MdSmartphone className='text-slate-50 pt-2' size="2rem" />
                </div>
                <AddressQrCode nanoAddress={props.nanoAddress} />
            </div>
        </div>
    )
}