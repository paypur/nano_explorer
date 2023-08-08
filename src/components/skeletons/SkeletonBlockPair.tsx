import SkeletonText from "./SkeletonText";
import SkeletonTextWide from "./SkeletonTextWide";

export default function SkeletonBlockPair() {
    return (
        <div className="w-[85.25rem] flex flex-row space-x-20 py-2 px-4">
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