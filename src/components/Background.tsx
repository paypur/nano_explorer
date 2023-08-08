import Image from "next/image"

import tex from "public/The_Missing_textures.png"

export default function Background() {
    return (
        <Image
            className="-z-10"
            alt="bg"
            src={tex}
            placeholder="blur"
            quality={100}
            fill={true}
            sizes="100vw"
            style={{
                objectFit: 'cover',
            }}
        />
    )
}