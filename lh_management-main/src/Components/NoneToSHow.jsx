import React from 'react'

function NoneToSHow(props) {
    return (
        <div className='flex flex-col md:flex-row items-center justify-between w-fit p-4  bg-white border border-gray-100 rounded-lg shadow-sm lg:max-w-7xl left-1/2 top-6 dark:bg-gray-700 dark:border-gray-600'>
            {props.msg}
        </div>
    )
}

export default NoneToSHow
