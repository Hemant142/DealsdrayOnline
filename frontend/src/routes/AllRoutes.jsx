import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from '../pages/Homepage'
import Login from '../pages/Login'
import SignUp from '../pages/SignUp'
import PrivateRoutes from './PrivateRoutes'
import EmployeeList from '../pages/EmployeeList'


export default function AllRoutes() {
  return (
    <Routes>
        <Route path='/' element={<Homepage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/employeelist' element={<PrivateRoutes><EmployeeList/></PrivateRoutes>}/>
        {/* <Route path='/userprofile' element={<UserProfile/>} /> */}
    </Routes>
  )
}
