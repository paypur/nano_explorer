import { CustomBlockPair } from "@/constants/Types";
import BlockCard from "./BlockCard";
import SkeletonText from "./SkeletonText";

export default function BlockCardList(props: { blockList: CustomBlockPair[], blockHeight?: string, text: string, newHead?: any }) {
    return (
        <div className="w-full min-w-0 h-fit flex flex-col">
            <div className="text-lg font-medium flex flex-row py-2 px-4">
                <p className="max-h-[1.75rem]">{props.text}</p>
                <p className="font-mono">&nbsp;</p>
                {props.blockHeight !== undefined ?
                    props.blockHeight !== "" ?
                        <p className="font-mono">({props.blockHeight})</p> : <SkeletonText /> : null}
            </div>
            {props.blockList.map((blockPair: CustomBlockPair, index) => (
                props.newHead === undefined ?
                    <BlockCard
                        key={blockPair.block1.hash}
                        blockPair={blockPair}
                    /> :
                    <BlockCard
                        key={blockPair.block1.hash}
                        blockPair={blockPair}
                        // second to last to load in advanced
                        isLast={index === props.blockList.length - 2}
                        newHead={props.newHead}
                    />
            ))}
        </div>
    )
}