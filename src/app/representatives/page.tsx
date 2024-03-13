import AddressAliasAsync from "@/components/address/AddressAliasAsync";
import RepresentativeStatus from "@/components/representative/RepresentativeStatus";
import { getConfirmationQuorum, getRepresentativesOnline } from "@/serverFunctions/RPCs";

import { tools } from "nanocurrency-web";

export default async function representativesPage() {

    const reps: any[] = await getRepresentativesOnline()
    const onlineStakeTotal = await getConfirmationQuorum()

    let repWeightArray: any[][] = []

    for (var key in reps) {
        if (reps.hasOwnProperty(key)) {
            // repWeightArray.push(key + " -> " + reps[key].weight)
            repWeightArray.push([key, reps[key].weight])
        }
    }

    repWeightArray.sort((a, b) => b[1] - a[1])

    return (
        <div className="flex flex-col my-8 px-4 space-y-2">
            <p className="text-lg text-white">Representatives</p>
            {repWeightArray.map((rep) => (
                <div className="flex flex-row space-x-2">
                    <div className="flex flex-col">
                        <RepresentativeStatus nanoAddress={rep[0]} />
                        <AddressAliasAsync nanoAddress={rep[0]} />
                    </div>
                    <p className="font-mono self-end">Ӿ{tools.convert(rep[1], 'RAW', 'NANO').split(".")[0]} ({(rep[1] / onlineStakeTotal * 100).toFixed(2)}%)</p>
                </div>
            ))}
        </div>
    )

}