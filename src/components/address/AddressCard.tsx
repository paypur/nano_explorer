import AddressQrCode from './AddressQrCode'

import AddressAlias from './AddressAlias'
import AddressRepresentativeInfo from './AddressRepresentativeInfo'
import AddressWeight from './AddressWeight'
import AddressBalance from './AddressBalance'
import AddressReceivableBalance from './AddressReceivableBalance'
import { getAccountWeight } from '@/functions/RPCs'

export default async function AddressCard(props: { nanoAddress: string }) {

    const isRepresentative = (await getAccountWeight(props.nanoAddress)) !== "0"

    return (
        <div className="flex flex-col my-8 px-4 space-y-4">
            <p className='text-lg font-medium'>Account Information</p>
            <div className='flex flex-row space-x-4 justify-between'>

                <div className='flex flex-col space-y-2 min-w-0'>

                    <div className='flex flex-col'>
                        <p className='text-gray-400'>Address</p>
                        <AddressAlias nanoAddress={props.nanoAddress} />
                    </div>

                    <div className='flex flex-row space-x-4'>
                        <div className='flex flex-col'>
                            <p className='text-gray-400'>Balance</p>
                            {/* @ts-expect-error Server Component */}
                            <AddressBalance nanoAddress={props.nanoAddress}/>
                        </div>

                        <div className='flex flex-col'>
                            <p className='text-gray-400'>Receiveable Balance</p>
                            {/* @ts-expect-error Server Component */}
                            <AddressReceivableBalance nanoAddress={props.nanoAddress}/>
                        </div>

                    </div>
                    
                    <div className='flex flex-col min-w-0'>
                        {/* @ts-expect-error Server Component */}
                        <AddressRepresentativeInfo nanoAddress={props.nanoAddress}/>
                    </div>

                    {isRepresentative ?
                        <>
                            {/* @ts-expect-error Server Component */}
                            <AddressWeight nanoAddress={props.nanoAddress}/>
                        </>
                        : null}
                </div>

                <div className='shrink-0'>
                    <p className='text-gray-400'>Address QR Code</p>
                    <AddressQrCode nanoAddress={props.nanoAddress} />
                </div>

            </div>
        </div>
    )
}