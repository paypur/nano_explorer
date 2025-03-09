import Link from "next/link"

export default function FormatLink(props: { path: string, type: string }) {
    // TODO: breaks truncation
    return <Link className="max-w-fit font-mono truncate select-all hover:underline" href={`/${props.type}/` + props.path}>
        {props.path.slice(0,4) == "nano" ?
            <div className={"flex items-center"}>
                <p className={"text-sm"}>{props.path.substring(0,5)}</p>
                <p className={"text-blue-400"}>{props.path.substring(5,13)}</p>
                <p>{props.path.substring(13,59)}</p>
                <p className={"text-yellow-400"}>{props.path.substring(57)}</p>
            </div> :
            <p>{props.path}</p>
        }
    </Link>
}