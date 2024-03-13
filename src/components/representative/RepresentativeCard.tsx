import RepresentativeWeight from "./RepresentativeWeight"
import RepresentativeDelegators from "./RepresentativeDelegators"
import RepresentativeStatus from "./RepresentativeStatus"
import RepresentativeWeightGraph from "./RepresentativeWeightGraph"
import { SkeletonText40rem, SkeletonText4rem } from "../skeletons/SkeletonText"
import { getAccountWeight } from "@/serverFunctions/RPCs"

import { addressToID } from "@/serverFunctions/MapNode"
import FormatLink from "../FormatLink"

import { Suspense } from "react"
import { getAlias } from "@/serverFunctions/Alias"

export default async function RepresentativeCard(props: { nanoAddress: string }) {
    // check if address is a rep
    if ((await getAccountWeight(props.nanoAddress)) !== "0") {

        const Nodeid = async () => {
            const id = await addressToID(props.nanoAddress)
            // const a = await getAlias(props.nanoAddress)
            return (
                <>
                    {/* <p className="font-mono font-medium text-white truncate">{a}</p> */}
                    {id !== undefined ? <FormatLink path={id} type="node" /> : <p>Node ID unknown</p>}
                </>
            )
        }

        return (
            <div className="flex flex-col my-8 px-4 space-y-2">
                <p className='text-lg font-medium'>Representative Information</p>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col space-y-2">

                        <div>
                            <p className='text-gray-400'>Node ID</p>
                            <Suspense fallback={<div className="flex flex-row">
                                <SkeletonText4rem />
                            </div>}>
                                {/* @ts-expect-error Server Component */}
                                <RepresentativeStatus nanoAddress={props.nanoAddress} />
                                {/* @ts-expect-error Server Component */}
                                <Nodeid />
                            </Suspense>
                        </div>

                        <div>
                            <p className='text-gray-400'>Voting Weight</p>
                            <Suspense fallback={<>
                                <SkeletonText40rem />
                                <SkeletonText40rem />
                            </>}>
                                {/* @ts-expect-error Server Component */}
                                <RepresentativeWeight nanoAddress={props.nanoAddress} />
                            </Suspense>

                        </div>

                        <div>
                            <p className='text-gray-400'>Delegators</p>
                            <Suspense fallback={<>
                                <SkeletonText4rem />
                            </>}>
                                {/* @ts-expect-error Server Component */}
                                <RepresentativeDelegators nanoAddress={props.nanoAddress} />
                            </Suspense>
                        </div>

                    </div>

                    <div>
                        <p className='text-gray-400'>Voting Weight over Time</p>
                        <RepresentativeWeightGraph nanoAddress={props.nanoAddress} />
                    </div>
                </div>


            </div>
        )
    }

}