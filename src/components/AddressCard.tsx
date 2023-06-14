import FormatLink from './FormatLink'

export default function AddressCard(props: { nanoAddress: string, balance: string, representative: string }) {
    return (
        <div className="flex flex-col my-8 py-2 px-4 border rounded border-sky-700">
            <p className='font-normal'>{props.nanoAddress}</p>
            <p className='font-sans text-sm text-slate-200'>Balance<span className='font-mono text-lg text-slate-50'>&nbsp;Ӿ{props.balance}</span></p>
            <p className='font-sans text-sm'>Representative<span className='font-mono text-lg'>&nbsp;</span><FormatLink path={props.representative} type="address"/></p>
        </div>
    )
}