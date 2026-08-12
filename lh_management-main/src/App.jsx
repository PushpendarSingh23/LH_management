import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./index.css";
import Login from "./Pages/Login";
import Request from "./Pages/Request";
import BookLt from "./Pages/BookLt";
import { SnackbarProvider } from "./Components/SnackBar";
import http from "./lib/http";
import Home from "./Components/Home/Home";
import { useCookies } from "react-cookie";
import Logout from "./Components/Logout/Logout";
import ReqLogs from "./Components/RequestLog/ReqLogs";

const backendURL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const navigate = useNavigate()
  const cookie=useCookies()
  const [auth,setAuth]=useState(false)
  const role=localStorage.getItem('role')
  const validateToken= async ()=>{
    try{
      await http.get(`${backendURL}/api/user`).then((resp)=>{
        if(resp.status===200){
          setAuth(true)
          if(localStorage){
            localStorage.setItem('role',resp?.data.user.role)
            localStorage.setItem('id',resp?.data.user.userId)
            localStorage.setItem('email',resp?.data.user.email)
            // window.location.reload(true)
          }
          else{

          }
        }
        
      }).catch(function (err){
        navigate('/login')
      })
    }
    catch(err){
      navigate('/login')
      console.log(err)
    }
  }

  useEffect( ()=>{
      validateToken()
      // console.log(cookie)
      // if(cookie.includes('jwt')){
      //   setAuth(true)
      // }
      // else{
      //   navigate('/login')
      // }
  },[])
  return (
    <SnackbarProvider>
        <Routes>
          {auth && <Route path="/" element={<Home />} />  }
          {auth && (role==='systemAdministrator' || role==='assistantRegistrar' || role==='facultyMentor') &&  <Route path="/requests" element={<Request />} /> }
          {auth && role==='gsec' && role!=='guard'  && <Route path="/book" element={<BookLt />} /> }
          {auth &&  role==='gsec'&& role!=='guard' && <Route path="/reqLogs" element={<ReqLogs />} /> }
          <Route path="/login" element={<Login />} />

          <Route path="/logout" element={<Logout/>} />
         
          
        </Routes>
    </SnackbarProvider>
  )
}

export default App
