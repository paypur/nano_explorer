import Link from "next/link"

export default function FormatLink(props: { path: string, type: string }) {
    // TODO: copy paste broken
    // using spans breaks truncation in the middle
    return <Link className="max-w-fit font-mono truncate select-all hover:underline" href={`/${props.type}/` + props.path}>
        {props.type == "address" ?
            <div className={"flex items-center shrink-0"}>
                <p className={"flex-none"}>{props.path.substring(0,5)}</p>
                <p className={"flex-none text-blue-400"}>{props.path.substring(5,13)}</p>
                <p className={"truncate"}>{props.path.substring(13,59)}</p>
                <p className={"flex-none text-yellow-400"}>{props.path.substring(57)}</p>
            </div> :
            <p>{props.path}</p>
        }
    </Link>
}