import SkeletonText from "./SkeletonText";
import SkeletonTextWide from "./SkeletonTextWide";

export default function SkeletonBlockPair() {
    return (
        <div className="flex flex-row space-x-12 py-2 px-4">
            <div>
                <SkeletonText/>
                <SkeletonText/>
                <SkeletonTextWide/>
                <SkeletonTextWide/>
                <SkeletonTextWide/>
            </div>
            <div>
                <SkeletonText/>
                <SkeletonText/>
                <SkeletonTextWide/>
                <SkeletonTextWide/>
                <SkeletonTextWide/>
            </div>
        </div>
    )
}