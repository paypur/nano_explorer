import BlockManager from "@/components/BlockManager"

export default function Home() {
    const subscription = {
        "action": "subscribe",
        "topic": "confirmation",
    }

    return (
        <BlockManager nanoAddress={""} subscription={subscription} />
    )
}