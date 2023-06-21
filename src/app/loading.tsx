import BlockCard from "@/components/BlockCard";
import { CustomBlock } from "@/constants/Types";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return <div className="my-[12rem] w-full">
        <p className="my-20 text-8xl font-normal text-center">LOADING</p>
    </div>
}