import { getAccountWeight } from "@/functions/RPCs"
import RepresentativeWeight from "./RepresentativeWeight"
import { Suspense } from "react"
import SkeletonTextWide from "../skeletons/SkeletonTextWide"
import SkeletonText from "../skeletons/SkeletonText"
import RepresentativeDelegators from "./RepresentativeDelegators"
import RepresentativeStatus from "./RepresentativeStatus"

export default async function RepresentativeCard(props: {nanoAddress: string}) {
    // check if address is a rep
    if ((await getAccountWeight(props.nanoAddress)) !== "0") {

        return (
            <div className="flex flex-col my-8 mx-4 space-y-4">
                <p className='text-lg font-medium'>Representative Information</p>
                    <div>
                        <p className='text-gray-400'>Representative Status</p>
                        <Suspense fallback={<div className="flex flex-row">
                            <SkeletonText/> 
                        </div>}> {/* @ts-expect-error Server Component */}
                            <RepresentativeStatus nanoAddress={props.nanoAddress}/>
                        </Suspense>
                    </div>


                <div className="flex flex-row space-x-4">
                    <div>
                        <p className='text-gray-400'>Voting Weight</p>
                        <Suspense fallback={<>
                            <SkeletonTextWide/>
                            <SkeletonTextWide/>
                        </>}> {/* @ts-expect-error Server Component */}
                            <RepresentativeWeight nanoAddress={props.nanoAddress}/>
                        </Suspense>
                    </div>

                    <div>
                        <p className='text-gray-400'>Delegator Count</p>
                        <Suspense fallback={<>
                            <SkeletonText/>
                        </>}> {/* @ts-expect-error Server Component */}
                            <RepresentativeDelegators nanoAddress={props.nanoAddress}/>
                        </Suspense>
                    </div>
                </div>

            </div>
        )
    }
    
}