import zIndex from "@mui/material/styles/zIndex";
import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthContextComponent = ({ children }) => {
  const [user, setUser] = useState( JSON.parse(localStorage.getItem("userInfo")) || {});
  const [isLogged, setIsLogged] = useState( JSON.parse(localStorage.getItem("isLogged")) || false);
  const adminNuevos = import.meta.env.VITE_ADMINNUEVOS;
  const adminProspMiembros = import.meta.env.VITE_ADMINPROSPMIEMBROS;
  const style = {
    display: "flex",
    gap: "4px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    zIndex:100,
    "@media (min-width: 768px)": {
      width: "60%",
    },
  };

  const handleLogin = (userLogged) => {
    setUser(userLogged);
    setIsLogged(true);
    localStorage.setItem("userInfo", JSON.stringify(userLogged))
    localStorage.setItem("isLogged", JSON.stringify(true))
    setTimeout(() => {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("isLogged");
    }, 4 * 60 * 60 * 1000);
  };

  const logoutContext = () => {
    setUser({});
    setIsLogged(false);
    localStorage.removeItem("userInfo")
    localStorage.removeItem("isLogged")
  };

  const [changeFecha, setChangeFecha] = useState(false)

  const motivoInasistencia = {
    enfermedad: "Enfermedad",
    enfermedadFamiliar:"Enfermedad familiar" ,
    trabajo: "Trabajo",
    vacaciones: "Vacaciones",
    recursos: "Falta de recursos",
    apatia: "Apatia",
    desconocido: "Desconocido"
  }

  let data = {
    user,
    isLogged,
    handleLogin,
    logoutContext,
    style,
    adminNuevos,
    adminProspMiembros,
    motivoInasistencia,
    changeFecha,
    setChangeFecha
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export default AuthContextComponent;