import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"


const ProtectedAdmin = () => {
    const {user} = useContext(AuthContext)
    const admin = import.meta.env.VITE_ADMIN
  return <>
  {
    user?.rol === admin ? <Outlet/> : <Navigate to="/bienvenido"/>
  }
  </>
}

export default ProtectedAdmin