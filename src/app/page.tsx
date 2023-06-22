import BlockCardList from "@/components/BlockCardList";
import { AccountHistoryBlock, CustomBlock, WSBlock } from "@/constants/Types"

export default function Home() {

    const nanoAddress = ""
    const transactions: AccountHistoryBlock[] = []
    const subscription = {
        "action": "subscribe",
        "topic": "confirmation",
    }

    return (
        <div>
            <BlockCardList nanoAddress={nanoAddress} blocks={transactions} MAX_BLOCKS={100} text="Confirmed Transactions" subscription={subscription}/>
        </div>
    )
}