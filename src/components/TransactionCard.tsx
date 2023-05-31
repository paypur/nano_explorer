import Link from 'next/link'
import { tools } from 'nanocurrency-web'
import { MdOutlineWest, MdOutlineEast } from "react-icons/md"

const node = "http://98.35.209.116:7076"

// https://stackoverflow.com/questions/63883580/tailwind-css-how-to-style-a-href-links-in-react

export default function TransactionCard(props: {transaction: any}) {
    const amount = <p>Ӿ{parseFloat(tools.convert(props.transaction.amount, 'RAW', 'NANO')).toFixed(6)}</p>
    let type: string = ""
    let account: string = ""
    let accountLink: string = ""

    // block history
    if (props.transaction.type !== undefined) {
        type = props.transaction.type
        account = props.transaction.account
        accountLink = "missing link acc"
    }
    // websocket
    else if (props.transaction.block !== undefined) {
        type = props.transaction.block.subtype
        account = props.transaction.block.account
        accountLink = props.transaction.block.link_as_account
    }
    // rpc
    else if (props.transaction.contents !== undefined) {
        type = props.transaction.subtype
        account = props.transaction.contents.account
        accountLink = props.transaction.contents.link_as_account
    }

    return (
        <div className='flex flex-col py-2 px-4 border-sky-700'>
            {txnHandler(amount, type, account, accountLink)}
            <Link className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={"/block/" + props.transaction.hash}>
                <p>{props.transaction.hash}</p>
            </Link>
        </div>
    )
}

function txnHandler(amount, type: string, account: string, accountLink: string) {
    if (type === "receive") {
        return (
            <div className="flex flex-col">
                <p className="flex flex-row text-emerald-600">RECEIVE</p>
                {amount}
                <div className='flex flex-row'>
                    {addressFormat(account)} <MdOutlineWest className='mx-2'></MdOutlineWest> {addressFormat(accountLink)}
                </div>
            </div>
        )
    }
    else if (type === "send") {
        return (
            <div className="flex flex-col">
                <p className="flex flex-row text-rose-600">SEND</p>
                {amount}
                <div className='flex flex-row'>
                    {addressFormat(account)} <MdOutlineEast className='mx-2'></MdOutlineEast> {addressFormat(accountLink)}
                </div>
            </div>
        )
    }
}

function addressFormat(address: string) {
    if (address !== undefined) {
        // <p>{address.slice(0,12) + "..." + address.slice(-6)}</p>
        return (
            <Link className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={"/address/" + address}>
                <p>{address}</p>
            </Link>
        )  
    }
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

// {
//     "account": "nano_1tipnanogsu7q59pnie3qfc4w378wm43fg4ksqc8wmnnfnizrq1xrpt5geho",
//     "amount": "3014000000000000000000000000",
//     "hash": "3DA440BC4B9FA8A9B63800785247D3EF6BDF821BC26C932E3F7CC1350DE4CED7",
//     "confirmation_type": "active_quorum",
//     "block": {
//         "type": "state",
//         "account": "nano_1tipnanogsu7q59pnie3qfc4w378wm43fg4ksqc8wmnnfnizrq1xrpt5geho",
//         "previous": "495475C6A61D6BE921A8C020042E1435A12CF5987150FB3A99C4C0D00732568F",
//         "representative": "nano_1tipnanogsu7q59pnie3qfc4w378wm43fg4ksqc8wmnnfnizrq1xrpt5geho",
//         "balance": "34481687726683523401275528777782",
//         "link": "AF1AB09E3AB1742CDA8D74087DA38F92DDB3850F0F434594913DEA465A035E08",
//         "link_as_account": "nano_3drtp4h5oedn7mfatx1ahpjrz6pxpg4iy5t5apcb4hhcasf18qiatmoqcwn3",
//         "signature": "C2C8ABB6EBB5D04E10B392EA3E71C47A25C71CF8C017ADA2EAD3CF9236D488ECB6256DACC6D3EB013A75CCC0B1A41224F316D040658EC20C6CCFF58B07912207",
//         "work": "b057af30a6376623",
//         "subtype": "send"
//     }
// }

// account: 'nano_1gbpbqy4m6y5i1s1hngnr3u4np63k31xpfigceafo5kpghy3gwycijh63xtn',
// amount: '500000000000000000000000000',
// hash: 'F773C4C3140E7C8575C7CF36363A8DC6889F5262E891CBEC24EB5A178ADC0348',
// confirmation_type: 'active_quorum',
// block: {
//     type: 'state',
//     account: 'nano_1gbpbqy4m6y5i1s1hngnr3u4np63k31xpfigceafo5kpghy3gwycijh63xtn',
//     previous: '0000000000000000000000000000000000000000000000000000000000000000',
//     representative: 'nano_1natrium1o3z5519ifou7xii8crpxpk8y65qmkih8e8bpsjri651oza8imdd',
//     balance: '500000000000000000000000000',
//     link: 'DBF10818609A53068AEB1496BAB1D8DF0CD350E797BFDB53C6AC461D5B196C4D',
//     link_as_account: 'nano_3pzj31e838km1t7gp76pqcrxjqretfagh7xzufbwfd485ofjku4f53bboow3',
//     signature: '1EC5212EE6FE38F2193EDED2943DD5F9B53A1E097929F9D0AD24FCC055007D7ECC6FE19160B0DDC7D5D7282781C6B0C54C4E6CDE1A3F504C3E24FA54161D0A08',
//     work: '00000000022f8886',
//     subtype: 'receive'
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
