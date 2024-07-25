import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"


const ProtectedAdmin = () => {
    const {user, isLogged} = useContext(AuthContext)
    const adminNuevos = import.meta.env.VITE_ADMINNUEVOS
    const adminProspMiembros = import.meta.env.VITE_ADMINPROSPMIEMBROS
    
  return <>
  {
    isLogged ? 
      (user?.rol === adminNuevos || user?.rol === adminProspMiembros) ? <Outlet/> : <Navigate to="/bienvenido"/>
    : <Navigate to="/login"/>
  }
  </>
}

export default ProtectedAdmin