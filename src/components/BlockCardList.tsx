import { CustomBlockPair } from "@/constants/Types";
import BlockCard from "./BlockCard";

export default function BlockCardList(props: { blockList: CustomBlockPair[], blockHeight?: string, newHead?: any }) {
    return (
        <>
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
        </> 
    )
}