export default function CommentLoader() {
    return (
        <div className="w-full grid grid-cols-10 grid-rows-3 p-4">
            <div className="hidden lg:block col-span-1 row-span-3 p-2 animate-pulse">
                <div className='w-12 h-12 opacity-50 bg-gray-500 rounded-full inline-block'/>
            </div>
            <div className="col-span-10 lg:col-span-9 row-span-1 text-right bg-[#2f4dd445] border-2 border-black grid grid-cols-2 p-2 animate-pulse">
                <div className="flex text-left px-2 items-center">
                    <div className='basis-3/4 w-10/12 h-4 opacity-50 bg-gray-500 rounded inline object-center' />
                    <div className='w-4 h-4 opacity-50 bg-gray-500 rounded-full inline-block'/>
                </div>
                {/* <div className='basis-3/4 w-10/12 h-4 opacity-50 bg-gray-500 rounded inline object-center' /> */}
            </div>
            <div className="flex col-span-10 lg:col-span-9 row-span-2 border-2 border-black p-2 animate-pulse">
                <div className='basis-3/4 w-10/12 h-4 opacity-50 bg-gray-500 rounded inline object-center' />
            </div>
        </div>
        )
}