import Link from "next/link"
import React from "react"

export default function FormatLink(props: { path: string, type: string }) {
    return (
        <Link className="max-w-fit font-mono text-lg truncate select-all hover:underline" href={`/${props.type}/` + props.path}>
            {props.path}
        </Link>
    )
}