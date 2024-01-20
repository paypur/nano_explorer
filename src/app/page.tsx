import BlockManager from "@/components/BlockManager"

export default function Home() {
    const subscription = {
        "action": "subscribe",
        "topic": "confirmation",
    }

    return (
        <div className="w-full">
            <BlockManager nanoAddress={""} subscription={subscription} />
        </div>
    )
}