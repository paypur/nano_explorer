"use client"

import { CustomBlock } from '@/constants/Types'
import { useEffect, useRef } from 'react'
import BlockHalf from './BlockHalf';
import { MdOutlineEast, MdOutlineWest } from 'react-icons/md';

export default function BlockCard (props: { block1: CustomBlock, block2?: CustomBlock, isLast?: boolean, newHead?: any }) {
    //https://stackoverflow.com/questions/74297001/type-mutablerefobjecthtmlinputelement-undefined-is-not-assignable-to-type
    const cardRef = useRef<HTMLInputElement>(null);

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
        <div className='flex flex-row py-2 px-4 border-sky-700' ref={cardRef}>
            <BlockHalf block={props.block1}/>
            {props.block1.type === "send" ? <MdOutlineEast className='mx-2 text-rose-600 min-w-fit self-center' /> : <MdOutlineWest className='mx-2 text-emerald-600 min-w-fit self-center' />}
            {/* https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator */}
            {props.block1.type !== "change" ? <BlockHalf block={props.block2!}/> : null}
        </div>
    )
}
