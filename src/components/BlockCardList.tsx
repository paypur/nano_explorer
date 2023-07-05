import { CustomBlockPair } from "@/constants/Types";
import BlockCard from "./BlockCard";

export default function BlockCardList(props: { blockList: CustomBlockPair[], blockHeight: string, text: string, newHead?: any }) {
    return (
        <div className="w-full min-w-0 h-fit flex flex-col border border-sky-700 divide-y rounded">
            <div className="py-2 px-4">
                <p>{props.text}<span className="font-mono">&nbsp;{props.blockHeight !== "" ? `(${props.blockHeight})` : ""}</span></p>
            </div>
            {props.newHead === undefined ? props.blockList.map((transaction: CustomBlockPair, index) => (
                <BlockCard
                    key={transaction.block1.hash}
                    block1={transaction.block1}
                    block2={transaction.block2}
                />
            )) : props.blockList.map((transaction: CustomBlockPair, index) => (
                <BlockCard
                    key={transaction.block1.hash}
                    block1={transaction.block1}
                    block2={transaction.block2}
                    // second to last to load in advanced
                    isLast={index === props.blockList.length - 2}
                    newHead={props.newHead}
                />            
            ))}
        </div>
    )
}