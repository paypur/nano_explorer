import AddressQrCode from './AddressQrCode'
import AddressAlias from './AddressAlias'
import RepresentativeLabel from './RepresentativeLabel'
import { getAccountBalance, getAccountRepresentative, getAccountWeight, getConfirmationQuorum } from '@/functions/RPCs'
import { tools } from 'nanocurrency-web'
import { getNanoUSD } from '@/functions/ServerFunctions'

import { Suspense } from 'react'
import SkeletonText from './SkeletonText'

export default async function AddressCard(props: { nanoAddress: string }) {
    
    const isRepresentative = (await getAccountWeight(props.nanoAddress)) !== "0"

    const Balance = async () => {
        const balanceRaw = await getAccountBalance(props.nanoAddress)
        const balanceUSD = parseFloat(tools.convert(balanceRaw, 'RAW', 'NANO')) * parseFloat(await getNanoUSD())
        return (
            <>
                <p className='font-mono font-medium text-white truncate'>Ӿ{parseFloat(tools.convert(balanceRaw, 'RAW', 'NANO')).toFixed(6)}</p>
                <p className='font-mono truncate'>${balanceUSD.toFixed(2)}</p>
            </>
        )
    }

    const Representative = async () => {
        const rep = await getAccountRepresentative(props.nanoAddress)
        return (
            <>
                {/* @ts-expect-error Server Component */}
                <RepresentativeLabel nanoAddress={rep} />
                <AddressAlias nanoAddress={rep}/>
            </>
        )
    }

    const RepWeight = async () => {
        const votingWeight = await getAccountWeight(props.nanoAddress)
        const onlineStakeTotal = await getConfirmationQuorum()
        const precentVotingWeight = votingWeight / onlineStakeTotal
        return (
            <>
                <p className='text-sm text-gray-400'>Voting Weight</p>
                <p className='font-mono font-medium text-white truncate'>Ӿ{parseFloat(tools.convert(votingWeight, 'RAW', 'NANO')).toFixed(6)}</p>
                <p className='max-h-[1.75rem]'><span className='font-mono truncate'>{(precentVotingWeight * 100).toFixed(2)}%&nbsp;</span>of online voting weight</p>
            </>
        )
    }

    return (
        <div className="flex flex-row justify-between my-8 py-2 px-4 border border-sky-700 rounded">
            <div className='flex flex-col min-w-0 mr-4'>
                <p className='text-sm text-gray-400'>Account</p>
                <AddressAlias nanoAddress={props.nanoAddress}/>

                <p className='text-sm text-gray-400'>Balance</p>
                <Suspense fallback={
                    <>
                        <SkeletonText/>
                        <SkeletonText/>
                    </>
                }>
                    {/* @ts-expect-error Server Component */}
                    <Balance/>
                </Suspense>

                {isRepresentative  ? 
                    <Suspense fallback={<></>}>
                        {/* @ts-expect-error Server Component */}
                        <RepWeight/>
                    </Suspense>
                : null}

                <p className='text-sm text-gray-400'>Representative</p>
                <Suspense fallback={
                    <>
                        <SkeletonText/>
                        <SkeletonText/>
                    </>
                }>
                    {/* @ts-expect-error Server Component */}
                    <Representative/>
                </Suspense>
            </div>
            <div className='flex flex-row items-center'>
                <div className='flex flex-col items-center mr-4'>
                    <p className='font-sans text-slate-50'>Account<br />QR code</p>
                    {/* <MdSmartphone className='text-slate-50 pt-2' size="2rem" /> */}
                </div>
                <AddressQrCode nanoAddress={props.nanoAddress} />
            </div>
        </div>
    )
}