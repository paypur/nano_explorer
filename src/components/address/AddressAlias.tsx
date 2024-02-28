import FormatLink from "../FormatLink"

export default function AddressAlias(props: { nanoAddress: string, alias: string | null }) {
    
    return ( 
        <>            
            <p className={`text-white truncate ${props.alias !== null ? "font-medium" : "font-light"}`}>{props.alias !== null ? props.alias : "No Alias"}</p>
            <FormatLink path={props.nanoAddress} type="address"/>
        </>
    )
}