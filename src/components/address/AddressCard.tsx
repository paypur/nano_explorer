import AddressQrCode from './AddressQrCode'
import AddressAlias from './AddressAlias'
import { getAccountBalance, getAccountWeight, getConfirmationQuorum } from '@/functions/RPCs'
import { tools } from 'nanocurrency-web'
import { getNanoUSD } from '@/functions/ServerFunctions'

import { Suspense } from 'react'
import AddressRepresentativeInfo from './AddressRepresentativeInfo'

export default async function AddressCard(props: { nanoAddress: string }) {

    const isRepresentative = (await getAccountWeight(props.nanoAddress)) !== "0"

    const AddressBalance = async () => {
        const balanceRaw = await getAccountBalance(props.nanoAddress)
        const balanceUSD = parseFloat(tools.convert(balanceRaw, 'RAW', 'NANO')) * parseFloat(await getNanoUSD())
        return (
            <div className='flex-row self-end'>
                <p className='font-mono font-medium text-white truncate'>Ӿ{parseFloat(tools.convert(balanceRaw, 'RAW', 'NANO')).toFixed(6)}</p>
                <p className='font-mono truncate'>${balanceUSD.toFixed(2)}</p>
            </div>
        )
    }

    const AddressRepWeight = async () => {
        const votingWeight = await getAccountWeight(props.nanoAddress)
        const onlineStakeTotal = await getConfirmationQuorum()
        const precentVotingWeight = votingWeight / onlineStakeTotal
        return (
            <div>
                <p className='text-gray-400'>Voting Weight</p>
                <p className='font-mono font-medium text-white truncate'>Ӿ{parseFloat(tools.convert(votingWeight, 'RAW', 'NANO')).toFixed(6)}</p>
                <p className='max-h-[1.75rem]'><span className='font-mono truncate'>{(precentVotingWeight * 100).toFixed(2)}%&nbsp;</span>of online voting weight</p>
            </div>
        )
    }

    return (
        <div className="flex flex-row justify-between my-8 py-2 px-4">
            <div className='flex flex-col min-w-0 space-y-2'>
                <p className='text-lg font-medium'>Account Info</p>
                
                <div>
                    <p className='text-gray-400'>Address</p>
                    <AddressAlias nanoAddress={props.nanoAddress} />
                </div>

                <div className='flex flex-row justify-between space-x-4'>
                    <div>
                        <p className='text-gray-400'>Balance</p>
                        {/* @ts-expect-error Server Component */}
                        <AddressBalance />
                    </div>

                    <div>
                        {/* @ts-expect-error Server Component */}
                        <AddressRepresentativeInfo nanoAddress={props.nanoAddress}/>
                    </div>
                </div>

                {isRepresentative ?
                    <Suspense fallback={<></>}>
                        {/* @ts-expect-error Server Component */}
                        <AddressRepWeight />
                    </Suspense>
                    : null}
            </div>
        </div>
    )
}
            // <div className='flex flex-row items-center'>
            //     <div className='flex flex-col items-center mr-4'>
            //         <p className='font-sans text-slate-50'>Account<br />QR code</p>
            //         {/* <MdSmartphone className='text-slate-50 pt-2' size="2rem" /> */}
            //     </div>
            //     <AddressQrCode nanoAddress={props.nanoAddress} />
            // </div>