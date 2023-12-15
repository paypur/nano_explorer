import BlockInfo from "@/components/BlockInfo"

export default function Home() {
    const subscription = {
        "action": "subscribe",
        "topic": "confirmation",
    }

    return (
        <div className="w-full">
            <BlockInfo nanoAddress={""} subscription={subscription}/>
        </div>
    )
}