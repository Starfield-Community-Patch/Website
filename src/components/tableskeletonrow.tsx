export default function TableSkeletonRow(props: { id?: string | number }) {
    const rowkey = `table-row-loader-${props.id ?? 0}`;

    return (
        <tr key={rowkey}>
            <td className='animate-pulse'><div className='w-10/12 h-4 opacity-50 bg-gray-500 rounded'></div></td>
            <td className='animate-pulse'>
                <div className='flex flex-row align-middle gap-2 content-center items-center'>
                    <div className='w-8 h-8 opacity-50 bg-gray-500 rounded-full inline-block'/>
                    <div className='basis-3/4 w-10/12 h-4 opacity-50 bg-gray-500 rounded inline object-center' />
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