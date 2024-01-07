

import { getRepresentativesOnline } from "@/functions/RPCs";

export default async function representativesPage() {



    const reps = await getRepresentativesOnline() 

    let repWeightArray: string[] = []

    function repweights (){
        for (var key in reps) {
            if (reps.hasOwnProperty(key)) {
                repWeightArray.push(key + " -> " + reps[key].weight)
            }
        }
    }


    return (
        <div>
            <p>Representatives</p>
            {repWeightArray.map((repWeight: string) => {
                return <p>{repWeight}</p>
            })}
        </div>
    )
}