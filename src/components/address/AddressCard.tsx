import AddressBalance from './AddressBalance'
import AddressQrCode from './AddressQrCode'
import AddressReceivableBalance from './AddressReceivableBalance'
import AddressRepresentativeInfo from './AddressRepresentativeInfo'
import { SkeletonText2Rem, SkeletonText42Rem, SkeletonText4Rem } from '../skeletons/SkeletonText'

import { Suspense } from 'react'
import AddressAliasAsync from './AddressAliasAsync'

export default function AddressCard(props: { nanoAddress: string }) {

    return <div className={"my-4 px-4"}>
        <p className='text-lg font-medium'>Account Information</p>

        <div className='flex flex-row space-x-4 justify-between'>
            <div className='flex flex-col space-y-1 min-w-0'>

                <div className='flex flex-col min-w-0'>
                    <p className='text-neutral-400'>Address</p>
                    <Suspense fallback={<div className='flex flex-col'>
                        <SkeletonText4Rem />
                        <SkeletonText42Rem />
                    </div>}>
                        {/* @ts-expect-error Server Component */}
                        <AddressAliasAsync nanoAddress={props.nanoAddress} />
                    </Suspense>
                </div>

                <div className='flex flex-row space-x-4 min-w-0'>

                    <div className='flex flex-col'>
                        <p className='text-neutral-400'>Balance</p>
                        <Suspense fallback={<div className='flex flex-col'>
                            <SkeletonText4Rem />
                            <SkeletonText2Rem />
                        </div>}>
                            {/* @ts-expect-error Server Component */}
                            <AddressBalance nanoAddress={props.nanoAddress} />
                        </Suspense>
                    </div>

                    <div className='flex flex-col'>
                        <p className='text-neutral-400'>Receivable Balance</p>
                        <Suspense fallback={<div className='flex flex-col'>
                            <SkeletonText4Rem />
                            <SkeletonText2Rem />
                        </div>}>
                            {/* @ts-expect-error Server Component */}
                            <AddressReceivableBalance nanoAddress={props.nanoAddress} />
                        </Suspense>
                    </div>

                </div>

                <div className='flex flex-col min-w-0'>
                    <p className='text-neutral-400'>Representative</p>
                    {/* @ts-expect-error Server Component */}
                    <AddressRepresentativeInfo nanoAddress={props.nanoAddress} />
                </div>

            </div>

            <div className='flex-1 w-[30.25rem]' />

            <div className='shrink-0'>
                <p className='text-neutral-400'>Address QR Code</p>
                <AddressQrCode nanoAddress={props.nanoAddress} />
            </div>

        </div>
    </div>
}