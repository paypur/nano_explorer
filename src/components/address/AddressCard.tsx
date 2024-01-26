
import AddressAlias from './AddressAlias'
import AddressBalance from './AddressBalance'
import AddressQrCode from './AddressQrCode'
import AddressReceivableBalance from './AddressReceivableBalance'
import AddressRepresentativeInfo from './AddressRepresentativeInfo'
import SkeletonText from '../skeletons/SkeletonText'
import SkeletonTextWide from '../skeletons/SkeletonTextWide'

import { Suspense } from 'react'

export default function AddressCard(props: { nanoAddress: string }) {

    return (
        <div className="flex flex-col my-8 px-4 space-y-4">
            <p className='text-lg font-medium'>Account Information</p>
            <div className='flex flex-row space-x-4 justify-between'>
                <div className='flex flex-col space-y-2 min-w-0'>

                    <div className='flex flex-col'>
                        <p className='text-gray-400'>Address</p>
                        <Suspense fallback={<div className='flex flex-col'>
                            <SkeletonText />
                            <SkeletonTextWide />
                        </div>}>
                            <AddressAlias nanoAddress={props.nanoAddress} />
                        </Suspense>
                    </div>

                    <div className='flex flex-row space-x-4'>

                        <div className='flex flex-col'>
                            <p className='text-gray-400'>Balance</p>
                            <Suspense fallback={<div className='flex flex-col'>
                                <SkeletonText />
                                <SkeletonText />
                            </div>}>
                                {/* @ts-expect-error Server Component */}
                                <AddressBalance nanoAddress={props.nanoAddress} />
                            </Suspense>
                        </div>

                        <div className='flex flex-col'>
                            <p className='text-gray-400'>Receiveable Balance</p>
                            <Suspense fallback={<div className='flex flex-col'>
                                <SkeletonText />
                                <SkeletonText />
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

                </div>

                <div className='flex-1 w-[27.625rem]' />

                <div className='shrink-0'>
                    <p className='text-gray-400'>Address QR Code</p>
                    <AddressQrCode nanoAddress={props.nanoAddress} />
                </div>

            </div>
        </div>
    )
}