import Link from "next/link"
import React from "react"

export default function FormatLink(props: {path: string, type: string}) {
    return (
        <Link className="hover:underline truncate" href={`/${props.type}/` + props.path}>
            <p className="font-mono text-slate-200 truncate">{props.path}</p>
        </Link>
    )  
}