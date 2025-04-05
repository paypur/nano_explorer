import { SkeletonText4Rem, SkeletonText42Rem, SkeletonText28Rem } from "./SkeletonText";

export default function SkeletonBlockPair() {
    return (
        <div className="flex flex-row space-x-8">
            <div className="min-w-0">
                <SkeletonText4Rem />
                <SkeletonText4Rem />
                <SkeletonText42Rem />
                <SkeletonText42Rem />
                <SkeletonText28Rem />
            </div>
            <div className="min-w-0">
                <SkeletonText4Rem />
                <SkeletonText4Rem />
                <SkeletonText42Rem />
                <SkeletonText42Rem />
                <SkeletonText28Rem />
            </div>
        </div>
    )
}