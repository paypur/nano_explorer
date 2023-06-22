import BlockInfo from "@/components/BlockInfo"

export default function Home() {
    const subscription = {
        "action": "subscribe",
        "topic": "confirmation",
    }

    return (
        <div>
            <BlockInfo nanoAddress={""} MAX_BLOCKS={100} subscription={subscription}/>
        </div>
    )
}