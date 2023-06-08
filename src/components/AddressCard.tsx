import FormatLink from './FormatLink'

export default function AddressCard(props: {nanoAddress: string, balance: string, representative: string}) {
    return (
        <div className="flex flex-col my-8 py-2 px-4 border rounded border-sky-700 font-mono">
            <p className='font-normal'>{props.nanoAddress}</p>
            <p>Balance: Ӿ{props.balance}</p>
            <div className='flex flex-row'>
                <p>Representative:&nbsp;</p><FormatLink path={props.representative} type="address"/>
            </div>
        </div>
    ) 
}