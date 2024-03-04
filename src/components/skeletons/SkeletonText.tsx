export function SkeletonText2rem() {
    return (
        <div className={`flex h-[1.5rem] pt-[0.3rem] pb-[0.2rem]`}>
            <div className='h-full w-[2rem] bg-gray-800 rounded animate-pulse' />
        </div>
    )
}

export function SkeletonText4rem() {
    return (
        <div className={`flex h-[1.5rem] pt-[0.3rem] pb-[0.2rem]`}>
            <div className='h-full w-[4rem] bg-gray-800 rounded animate-pulse' />
        </div>
    )
}

export function SkeletonText27rem() {
    return (
        <div className='flex h-[1.5rem] pt-[0.3rem] pb-[0.2rem]'>
            <div className={`h-full w-[28rem] bg-gray-800 rounded animate-pulse`} />
        </div>
    )
}

export function SkeletonText40rem() {
    return (
        <div className='flex h-[1.5rem] pt-[0.3rem] pb-[0.2rem]'>
            <div className={`h-full w-[40.625rem] bg-gray-800 rounded animate-pulse`} />
        </div>
    )
}