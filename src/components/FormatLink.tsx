import Link from "next/link"
import React from "react"

export default function FormatLink(props: {path: string, type: string}) {
    return (
        <Link className="hover:underline truncate" href={`/${props.type}/` + props.path}>
            <p className="font-mono truncate text-slate-200">{props.path}</p>
        </Link>
    )  
}