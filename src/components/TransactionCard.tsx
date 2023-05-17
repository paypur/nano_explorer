import Link from 'next/link'
import { tools } from 'nanocurrency-web'
import { MdOutlineFileDownload, MdOutlineFileUpload } from "react-icons/md"

export default function TransactionCard(props) {
    return (
        <div className='flex flex-col py-2 px-4 border-sky-700'>
            {txnHandler(props.transaction)}
            <Link className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={"/address/" + props.transaction.account}>
                <p>{props.transaction.account}</p>
            </Link>  
            <Link className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href={"/block/" + props.transaction.hash}>
                <p>{props.transaction.hash}</p>
            </Link>
        </div>
    )
}

function txnHandler(transaction: any) {
    const amount = <p className="text-white">Ӿ{parseFloat(tools.convert(transaction.amount, 'RAW', 'NANO')).toFixed(6)}</p>
    let type: string = ""

    if (transaction.type !== undefined) {
        type = transaction.type
    } else if (transaction.block !== undefined) {
        type = transaction.block.subtype
    }

    if (type === "receive") {
        return (
            <div className="flex flex-row text-emerald-600">
                <MdOutlineFileDownload size="1.25rem"/> 
                <p className="ml-1 mr-2">received</p>
                {amount}
            </div>
        ) 
    } else if (type === "send") {
        return (
            <div className="flex flex-row text-rose-600">
                <MdOutlineFileUpload size="1.25rem"/>
                <p className="ml-1 mr-2">sent</p>
                {amount}
            </div>
        )
    }
}

// type: 'receive',
// account: 'nano_1reason1q976g9wkrt69nux7konww46ux73c7xzm7jrm3w4kqdtigym6btq3',
// amount: '104227000000000000000000000000',
// local_timestamp: '1671259911',
// height: '41',
// hash: '66F87EBFE6D02434FAC8F3EF319BA61EF4141FC97A23D61A297B5490F1FF1DC6',
// confirmed: 'true'

// websocket
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