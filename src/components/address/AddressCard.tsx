import AddressQrCode from './AddressQrCode'

import AddressRepresentativeInfo from './AddressRepresentativeInfo'
import AddressWeight from './AddressWeight'
import AddressBalance from './AddressBalance'
import AddressReceivableBalance from './AddressReceivableBalance'
import { getAccountWeight } from '@/functions/RPCs'
import FormatLink from '../FormatLink'
import { getAlias } from '@/functions/ServerFunctions'
import AddressAlias from './AddressAlias'
import { Suspense } from 'react'
import SkeletonTextWide from '../skeletons/SkeletonTextWide'
import SkeletonQRCode from '../skeletons/SkeletonQRCode'
import useAsyncEffect from 'use-async-effect/types'

export default function AddressCard(props: { nanoAddress: string }) {

    return (
        <div className="flex flex-col my-8 px-4 space-y-4">
            <p className='text-lg font-medium'>Account Information</p>
            <div className='flex flex-row space-x-4 justify-between'>
                <div className='flex flex-col space-y-2 min-w-0'>
                    
                    <div className='flex flex-col'>
                        <p className='text-gray-400'>Address</p>
                        <Suspense fallback={<div className='flex flex-col'>
                            <SkeletonTextWide />
                            <SkeletonTextWide />
                        </div>}>
                            {/* @ts-expect-error Server Component */}
                            <AddressAlias nanoAddress={props.nanoAddress} />
                        </Suspense>
                    </div>

                    <div className='flex flex-row space-x-4'>
                        <div className='flex flex-col'>
                            <p className='text-gray-400'>Balance</p>
                            <Suspense fallback={<div className='flex flex-col'>
                                <SkeletonTextWide />
                                <SkeletonTextWide />
                            </div>}>
                                {/* @ts-expect-error Server Component */}
                                <AddressBalance nanoAddress={props.nanoAddress} />
                            </Suspense>
                        </div>

                        <div className='flex flex-col'>
                            <p className='text-gray-400'>Receiveable Balance</p>
                            <Suspense fallback={<div className='flex flex-col'>
                                <SkeletonTextWide />
                                <SkeletonTextWide />
                            </div>}>
                                {/* @ts-expect-error Server Component */}
                                <AddressReceivableBalance nanoAddress={props.nanoAddress} />
                            </Suspense>
                        </div>

                    </div>

                    <div className='flex flex-col min-w-0'>
                        {/* @ts-expect-error Server Component */}
                        <AddressRepresentativeInfo nanoAddress={props.nanoAddress} />
                    </div>


                    {/* @ts-expect-error Server Component */}
                    <AddressWeight nanoAddress={props.nanoAddress} />

                </div>

                <div className='shrink-0'>
                    <p className='text-gray-400'>Address QR Code</p>
                    {/* @ts-expect-error Server Component */}
                    <AddressQrCode nanoAddress={props.nanoAddress} />
                </div>

            </div>
        </div>
    )
}