import { RepWeight } from "@/constants/Types"
import RepresentativeHealth from "./RepresentativeHealth"
import RepresentativeType from "./RepresentativeType"
import FormatLink from "../FormatLink"
import { getAlias } from "@/server_functions/Alias"
import { tools } from "nanocurrency-web"

export default async function RepresentativeTableEntry(props: { repWeight: RepWeight, onlineStakeTotal: any }) {

    const alias = await getAlias(props.repWeight.address)

    return (
        <tr>
            <td className="px-2 py-1">
                {/* @ts-expect-error Server Component */}
                <RepresentativeType nanoAddress={props.repWeight.address}/>
            </td>
            <td className="px-2 py-1">
                {/* @ts-expect-error Server Component */}
                <RepresentativeHealth nanoAddress={props.repWeight.address}/>
            </td>
            <td className="px-2 py-1">
                <p className={`text-white truncate ${alias !== null ? "font-medium" : "font-light"}`}>{alias !== null ? alias : "No Alias"}</p>
            </td>
            <td className="px-2 py-1">
                <FormatLink path={props.repWeight.address} type="address"/>
            </td>
            <td className="px-2 py-1">
                <p className="font-mono text-right">Ӿ{tools.convert(props.repWeight.weight.toString(), 'RAW', 'NANO').split(".")[0]}</p>
            </td>
            <td className="px-2 py-1">
                <p className="font-mono text-right">{(props.repWeight.weight / props.onlineStakeTotal * 100).toFixed(2)}%</p>
            </td>
        </tr>
    )
}