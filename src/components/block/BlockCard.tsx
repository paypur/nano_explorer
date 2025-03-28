"use client"

import BlockHalf from './BlockHalf';
import { CustomBlockPair } from '@/constants/Types'

import { useEffect, useRef } from 'react'
import { MdOutlineEast, MdOutlineWest } from 'react-icons/md';

export default function BlockCard(props: { blockPair: CustomBlockPair, isLast?: boolean, newHead?: any }) {
    // https://stackoverflow.com/questions/74297001/type-mutablerefobjecthtmlinputelement-undefined-is-not-assignable-to-type
    const cardRef = useRef<HTMLInputElement>(null);

    // https://www.freecodecamp.org/news/how-to-implement-infinite-scroll-in-next-js/
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
        <div className='flex flex-row' ref={cardRef}>
            {props.blockPair.block1.type !== "epoch" ?
                <>
                    <BlockHalf block={props.blockPair.block1} />
                    {props.blockPair.block1.type === "send" ? <MdOutlineEast className='mx-2 min-w-fit self-center' /> : null}
                    {props.blockPair.block1.type === "receive" ? <MdOutlineWest className='mx-2 min-w-fit self-center' /> : null}
                    {/* https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator */}
                    {props.blockPair.block1.type !== "change" ? <BlockHalf block={props.blockPair.block2!} /> : null}
                </>
                :
                <p className='text-yellow-700'>TODO: EPOCH BLOCK</p>}
        </div>
    )
}
