import SkeletonText from "./SkeletonText";
import SkeletonTextWide from "./SkeletonTextWide";

export default function SkeletonBlockPair() {
    return (
        <div className="flex flex-row space-x-8 py-2 px-4">
            <div className="min-w-0">
                <SkeletonText/>
                <SkeletonText/>
                <SkeletonTextWide/>
                <SkeletonTextWide/>
                <SkeletonTextWide/>
            </div>
            <div className="min-w-0">
                <SkeletonText/>
                <SkeletonText/>
                <SkeletonTextWide/>
                <SkeletonTextWide/>
                <SkeletonTextWide/>
            </div>
        </div>
    )
}