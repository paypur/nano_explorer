export function SkeletonText2Rem() {
    return (
        <div className={`flex h-[1.5rem] pt-[0.3rem] pb-[0.2rem] z-3`}>
            <div className='h-full w-[2rem] bg-gray-800 rounded animate-pulse' />
        </div>
    )
}

export function SkeletonText4Rem() {
    return (
        <div className={`flex h-[1.5rem] pt-[0.3rem] pb-[0.2rem] z-3`}>
            <div className='h-full w-[4rem] bg-gray-800 rounded animate-pulse' />
        </div>
    )
}

export function SkeletonText28Rem() {
    return (
        <div className='flex h-[1.5rem] pt-[0.3rem] pb-[0.2rem] z-3'>
            <div className={`h-full w-[28rem] bg-gray-800 rounded animate-pulse`} />
        </div>
    )
}

export function SkeletonText42Rem() {
    return (
        <div className='flex h-[1.5rem] pt-[0.3rem] pb-[0.2rem] z-3'>
            <div className={`h-full w-[41.875rem] bg-gray-800 rounded animate-pulse`} />
        </div>
    )
}