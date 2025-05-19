import RepresentativeTableEntry from "@/components/representative/RepresentativeTableEntry";
import { RepWeight } from "@/constants/Types";
import { getConfirmationQuorum, getRepresentativesOnline } from "@/server_functions/RPCs";

export default async function representativesPage() {

    const reps: any[] = await getRepresentativesOnline()
    const onlineStakeTotal = await getConfirmationQuorum()

    let repWeightArray: RepWeight[] = []

    for (var key in reps) {
        if (reps.hasOwnProperty(key)) {
            repWeightArray.push({ address: key, weight: reps[key].weight})
        }
    }

    // sort by weight descending
    repWeightArray.sort((a, b) => b.weight - a.weight)

    return (
        <div className="my-4 px-4 space-y-2">
            <table>
                <thead className="sticky top-[150px] bg-black">
                    <tr>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Alias</th>
                        <th>Address</th>
                        <th>Weight</th>
                        <th>Percent</th>
                    </tr>
                </thead>
                <tbody>
                    {repWeightArray.map((repWeight, index) => (
                        <>
                            {/* @ts-expect-error Server Component */}
                            <RepresentativeTableEntry repWeight={repWeight} onlineStakeTotal={onlineStakeTotal}  />
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    )

}