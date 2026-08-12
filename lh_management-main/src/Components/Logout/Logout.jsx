import http from '../../lib/http'
import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


function Logout(props) {
    const {} = props
    const navigate= useNavigate()
    useEffect(()=>{
        http.get(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`).then((resp)=>{
                if(resp.status===200){
                    navigate('/login')
                    localStorage.removeItem("role");
                    localStorage.removeItem("id");
                    localStorage.removeItem("email");
                }
          }).catch(function (err){
            // showSnackbar({message:'try again',useCase:'error'})
          })
    },[])
    return (
        <div className='flex justify-center items-center h-screen w-screen  text-gray-900 dark:text-white '>Logging out</div>
    )
}

export default Logout
