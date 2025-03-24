import AddressCard from '@/components/address/AddressCard'
import RepresentativeCard from '@/components/representative/RepresentativeCard'
import BlockManager from '@/components/block/BlockManager'
import isValid from "nano-address-validator";
import {headers} from "next/headers";

export default async function AddressPage() {

    const headerList = await headers();
    const pathname = headerList.get("x-url");
    // @ts-ignore
    const nanoAddress = pathname.slice(-65)

    const subscription = {
        "action": "subscribe",
        "topic": "confirmation",
        "options": {
            "accounts": [nanoAddress]
        }
    }

    if (isValid(nanoAddress)) {
        return (
            // div required for margin collapsing
            // https://www.joshwcomeau.com/css/rules-of-margin-collapse/
            <div>
                <AddressCard nanoAddress={nanoAddress}/>
                {/* @ts-expect-error Server Component */}
                <RepresentativeCard nanoAddress={nanoAddress}/>
                <BlockManager nanoAddress={nanoAddress} subscription={subscription}/>
            </div>
        )
    }

    return (<div><p>Error 422 - Invalid Nano Address!</p></div>)
}