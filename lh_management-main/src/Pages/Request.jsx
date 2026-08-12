import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import LtReqs from '../Components/Requests/LtReqs'
import Card from '../Components/Requests/Card'
import Footer from '../Components/Footer/Footer'
import { SnackbarProvider } from '../Components/SnackBar'

function Request() {
    return (


        < div className='overflow-y-hidden h-screen'>
            <Navbar/>
            <section className="p-2 pb-0 flex flex-col items-center h-full ">
            {/* <Card/> */}
            <LtReqs/>
            <Footer/>
            </section>
        </div>

    )
}

export default Request
