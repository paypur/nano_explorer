import FormatLink from "../FormatLink"

export default function AddressAlias(props: { nanoAddress: string, alias: string | null }) {
    return ( 
        <div className={"max-w-[41.875rem] flex space-x-4"}>
            {props.alias !== null ? <p className={`pt-[1px] shrink-0 text-white font-medium`}>{props.alias}</p> : null}
            <FormatLink path={props.nanoAddress} type="address"/>
        </div>
    )
}