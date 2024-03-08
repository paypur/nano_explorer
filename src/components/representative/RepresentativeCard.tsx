import { getAccountWeight } from "@/functions/RPCs"
import RepresentativeWeight from "./RepresentativeWeight"
import RepresentativeDelegators from "./RepresentativeDelegators"
import RepresentativeStatus from "./RepresentativeStatus"
import { SkeletonText40rem, SkeletonText4rem } from "../skeletons/SkeletonText"
import RepresentativeWeightGraph from "./RepresentativeWeightGraph"
import { Suspense } from "react"

export default async function RepresentativeCard(props: { nanoAddress: string }) {
    // check if address is a rep
    if ((await getAccountWeight(props.nanoAddress)) !== "0") {
        return (
            <div className="flex flex-col my-8 mx-4 space-y-2">
                <p className='text-lg font-medium'>Representative Information</p>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col space-y-2">

                        <div>
                            <p className='text-gray-400'>Status</p>
                            <Suspense fallback={<div className="flex flex-row">
                                <SkeletonText4rem />
                            </div>}> {/* @ts-expect-error Server Component */}
                                <RepresentativeStatus nanoAddress={props.nanoAddress} />
                                {/* TODO: Total Sync?? */}
                                <p className='max-h-[1.5rem] truncate'><span className='font-mono'>0</span> seconds of uptime</p>
                            </Suspense>
                        </div>

                        <div>
                            <p className='text-gray-400'>Voting Weight</p>
                            <Suspense fallback={<>
                                <SkeletonText40rem />
                                <SkeletonText40rem />
                            </>}> {/* @ts-expect-error Server Component */}
                                <RepresentativeWeight nanoAddress={props.nanoAddress} />
                            </Suspense>

                        </div>
                        
                        <div>
                            <p className='text-gray-400'>Delegators</p>
                            <Suspense fallback={<>
                                <SkeletonText4rem />
                            </>}> {/* @ts-expect-error Server Component */}
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