"use client"

import { useQRCode } from 'next-qrcode'

export default function AddressQrCode(props: { nanoAddress: string }) {
    const { SVG } = useQRCode();
    return (
        <SVG
            text={`nano:${props.nanoAddress}`}
            options={{
                level: 'L',
                margin: 2,
                width: 250,
                color: {
                    dark: '#000000',
                    light: '#f8fafc',
                },
            }}
        />
    )
}