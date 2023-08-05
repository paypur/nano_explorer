import Link from "next/link"

export default function FormatLink(props: { path: string, type: string }) {
    return (
        <Link className="max-w-fit font-mono truncate select-all hover:underline" href={`/${props.type}/` + props.path}>
            {props.path}
        </Link>
    )
}