import { SkeletonText4rem, SkeletonText40rem, SkeletonText27rem } from "./SkeletonText";

export default function SkeletonBlockPair() {
    return (
        <div className="flex flex-row space-x-8">
            <div className="min-w-0">
                <SkeletonText4rem />
                <SkeletonText4rem />
                <SkeletonText40rem />
                <SkeletonText40rem />
                <SkeletonText27rem />
            </div>
            <div className="min-w-0">
                <SkeletonText4rem />
                <SkeletonText4rem />
                <SkeletonText40rem />
                <SkeletonText40rem />
                <SkeletonText27rem />
            </div>
        </div>
    )
}