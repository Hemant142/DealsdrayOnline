import React from 'react'
import Login from '../pages/Login';
import Cookies from 'js-cookie'; 
export default function PrivateRoutes({children}) {
const token = Cookies.get('token');
 if(!token){
    return <Login/>
 }
 return(
    children
 )
}
