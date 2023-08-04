export default function TableLoadingRow(props: { id?: string | number }) {
    const rowkey = `table-row-loader-${props.id ?? 0}`;

    return (
        <tr key={rowkey}>
            <td className='animate-pulse'>
                <div className='w-1/2 h-6 opacity-50 bg-gray-500 rounded my-1' />
                <div>
                    <div className='w-10 h-4 opacity-50 bg-gray-500 rounded inline-block mr-1' />
                    <div className='w-4 h-4 opacity-50 bg-gray-500 rounded-full inline-block mr-1'/>
                    <div className='w-20 h-4 opacity-50 bg-gray-500 rounded inline-block mr-1' />
                    <div className='w-1/3 h-4 opacity-50 bg-gray-500 rounded inline-block mr-1' />
                </div>
            </td>
            <td className='animate-pulse'>
                <div className='flex flex-row align-middle gap-1 content-center items-center'>
                    <div>💬 </div>
                    <div className='align-middle content-center'><div className='w-4 h-4 opacity-50 bg-gray-500 rounded' /></div>
                    
                </div>
            </td>
        </tr>
    )
}