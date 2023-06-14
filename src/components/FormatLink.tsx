import Link from "next/link"
import React from "react"

export default function FormatLink(props: { path: string, type: string }) {
    return (
        <Link className="font-mono text-lg truncate hover:underline" href={`/${props.type}/` + props.path}>
            {props.path}
        </Link>
    )
}