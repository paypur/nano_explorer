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
            <BlockCardList nanoAddress={nanoAddress} transactions={transactions} subscription={subscription} MAX_TRANSACTIONS={Number.MAX_SAFE_INTEGER} />
        </div>
    )
}