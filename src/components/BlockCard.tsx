"use client"

import { tools } from 'nanocurrency-web'
import { MdOutlineWest, MdOutlineEast } from "react-icons/md"
import { CustomBlock } from '@/constants/Types'
import FormatLink from '@/components/FormatLink'
import { useEffect, useRef } from 'react'

export default function BlockCard(props: { block: CustomBlock, isLast?: boolean, newHead?: any }) {
    //https://stackoverflow.com/questions/74297001/type-mutablerefobjecthtmlinputelement-undefined-is-not-assignable-to-type
    const cardRef = useRef<HTMLInputElement>(null);

    const amount = <span className='font-mono'>&nbsp;Ӿ{parseFloat(tools.convert(props.block.amount, 'RAW', 'NANO')).toFixed(6)}</span>
    const date = new Date(parseInt(props.block.timestamp))

    https://www.freecodecamp.org/news/how-to-implement-infinite-scroll-in-next-js/
    useEffect(() => {
        if (!cardRef?.current) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (props.isLast && entry.isIntersecting) {
                props.newHead();
                observer.unobserve(entry.target);
            }
        });
        observer.observe(cardRef.current);
    }, [props.isLast]);

    return (
        <div className='flex flex-col py-2 px-4 border-sky-700' ref={cardRef}>
            {props.block.type === "send" ? <p className="text-rose-600">SEND{amount}</p> : <p className="text-emerald-600">RECEIVE{amount}</p>}
            <div className='flex flex-row'>
                <FormatLink path={props.block.account} type="address" />
                {props.block.type === "send" ? <MdOutlineEast className='mx-2 text-rose-600 min-w-fit' /> : <MdOutlineWest className='mx-2 text-emerald-600 min-w-fit' />}
                <FormatLink path={props.block.accountLink} type="address" />
            </div>
            <FormatLink path={props.block.hash} type="block" />
            <p>{date.toString()}</p>
        </div>
    )
}