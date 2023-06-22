import { CustomBlock } from "@/constants/Types";
import BlockCard from "./BlockCard";

export default function BlockCardList(props: { blockList: CustomBlock[], blockHeight: string, text: string, newHead?: any }) {
    return (
        <div className="w-full min-w-0 h-fit flex flex-col border border-sky-700 divide-y rounded">
            <div className="py-2 px-4">
                <p>{props.text}<span className="font-mono">&nbsp;{props.blockHeight !== "" ? `(${props.blockHeight})` : ""}</span></p>
            </div>
            {props.newHead === undefined ? props.blockList.map((transaction: CustomBlock, index) => (
                <BlockCard
                    key={transaction.hash}
                    block={transaction}
                />
            )) : props.blockList.map((transaction: CustomBlock, index) => (
                <BlockCard
                    key={transaction.hash}
                    block={transaction}
                    isLast={index === props.blockList.length - 1}
                    newHead={props.newHead}
                />            
            ))}
        </div>
    )
}