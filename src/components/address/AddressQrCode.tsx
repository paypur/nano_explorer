"use client"

import { useQRCode } from 'next-qrcode'
import Link from 'next/link';

export default function AddressQrCode(props: { nanoAddress: string }) {
    const { SVG } = useQRCode();
    return (
        <Link href={`nano:${props.nanoAddress}`} title={`nano:${props.nanoAddress}`}>
            <SVG
                text={`nano:${props.nanoAddress}`}
                options={{
                    margin: 2,
                    width: 208,
                    color: {
                        dark: '#000000',
                        light: '#f3f4f6',
                    },
                }}
            />
        </Link>
    )
}