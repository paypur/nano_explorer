import { tools } from 'nanocurrency-web'
import { MdOutlineWest, MdOutlineEast } from "react-icons/md"
import { CustomBlock } from '@/constants/Types'
import FormatLink from '@/components/FormatLink'

// https://stackoverflow.com/questions/63883580/tailwind-css-how-to-style-a-href-links-in-react
export default function BlockCard(props: { block: CustomBlock }) {

    const date = new Date(parseInt(props.block.timestamp))
    if (props.block.amount === undefined){
        props.block.amount = "uh oh"
    }
    const amount = <span className='font-mono'>&nbsp;Ӿ{parseFloat(tools.convert(props.block.amount, 'RAW', 'NANO')).toFixed(6)}</span>

    // const cardRef = useRef();

    // useEffect(() => {
    // })

    return (
        <div className='flex flex-col py-2 px-4 border-sky-700'>
            <div className='flex flex-row font-normal'>
                {props.block.type === "send" ? <p className="text-rose-600">SEND{amount}</p> : <p className="text-emerald-600">RECEIVE{amount}</p>}
            </div>
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

// block history

// type: 'receive',
// account: 'nano_1reason1q976g9wkrt69nux7konww46ux73c7xzm7jrm3w4kqdtigym6btq3',
// amount: '104227000000000000000000000000',
// local_timestamp: '1671259911',
// height: '41',
// hash: '66F87EBFE6D02434FAC8F3EF319BA61EF4141FC97A23D61A297B5490F1FF1DC6',
// confirmed: 'true'

// websockets

// "topic": "confirmation",
// "time": "1684531647150",
// "message": {
//     "account": "nano_3ymi6a1cxbynhwb8q7d6px6zrku3qk8xwagukkub1zodt5timb4asjydack6",
//     "amount": "100000000000000000000000000000",
//     "hash": "7316A2322A3D080415832849485B8F04407BD96A5CC41F0ABA11A25F71149C6B",
//     "confirmation_type": "active_quorum",
//     "block": {
//         "type": "state",
//         "account": "nano_3ymi6a1cxbynhwb8q7d6px6zrku3qk8xwagukkub1zodt5timb4asjydack6",
//         "previous": "40D121252546791F83E07E013A0702B3B1B737433E6AD10017FD4914D3D333C9",
//         "representative": "nano_3rknipizeoii9kq7famra161wi9mr11mxxrh3foo87srtdxf9h5kqwwck4g9",
//         "balance": "99899980341599987399965010735062",
//         "link": "7244BD3FAEECFDDF822CFF8D751E77545B470F547A7AD626AC218159A515CCF9",
//         "link_as_account": "nano_1wk6qnztxu9xuy34szwfgnh9go4uaw9oaymttrmcrae3d8kjdm9sccu4ahx6",
//         "signature": "A100C2F76EB1493C185911B372ECE95ACD31B4B38F4FDC7FE0F1D3FD4EE42A7074F6A6D3A4AC00F268BE81E61C579A77725396F271D4AD3A78C6CB44B31BA10D",
//         "work": "b5c05d1eaa6794d2",
//         "subtype": "send"
//     }
// }

// rpc
// "block_account": "nano_1paypur3bf9oawtbfcm4gqeekirjy37jw3ttfsidhxw99aky8auqwaf6na9q",
// "amount": "21612000000000000000000000000",
// "balance": "1865105545989155385246189426796649",
// "height": "531",
// "local_timestamp": "1684903693",
// "successor": "0000000000000000000000000000000000000000000000000000000000000000",
// "confirmed": "true",
// "contents": {
//     "type": "state",
//     "account": "nano_1paypur3bf9oawtbfcm4gqeekirjy37jw3ttfsidhxw99aky8auqwaf6na9q",
//     "previous": "705E236298592166C6B310D9495F80E6781C55A96D2D35CA4F5B2D5579C259E1",
//     "representative": "nano_15zntj4a8r6bkihei788ciy1jgc5wnskan1gpgn8e8jku3r4qhr7rwifitir",
//     "balance": "1865105545989155385246189426796649",
//     "link": "FDD5EF4E850E13A6091D4E3C8B529F35C9747211104F1E3ADD0BB22CEE3A53BD",
//     "link_as_account": "nano_3zgoxx9ac5imnr6jtmjwjfbbyfgbgjs3464h5rxft4xk7mq5nnxxt5hkaqbw",
//     "signature": "5A383777537FC96908014E7548C2E8D9D4F5CE0F3802597D06CFBF3B4F20B66373131FFBAD1C6D1F42EAEB76A1ED9588842BBB6BC3776BE628BAFB0666313A01",
//     "work": "282323d57f39ae4f"
// },
// "subtype": "receive"
