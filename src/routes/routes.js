import {
    faArrowRightFromBracket,
    faChartLine,
    faEye,
    faCheck,
    faList
  } from "@fortawesome/free-solid-svg-icons";
  
  export const routes = [
    {
      id: 1,
      path: "/",  
      text: "Registrar visitantes", 
      icon:  faList },
    {
      id: 2,
      path: "/TomarAsistencia",
      text: "Tomar asistencia",
      icon: faCheck ,
    },
    { 
      id: 3,
      path: "/VerAsistencia", 
      text: "Ver asistencia",
      icon: faEye
  },
  {
    id: 4,
    path: "/dashboard",  
    text: "Dashboard",
    icon: faChartLine,
  },
  {id: 5,
    path: "/bienvenido",  
    text: "Bienvenido",
    icon: faChartLine,},
  {
    id: 6,
    path: "/login",  
    text: "Cerrar sesión",
    icon: faArrowRightFromBracket,
  }
  ];
  
  export const register = [
    {
      id:1,
      path: "/registro"
    }
  ]
  
  export const routesAdmin = [
    {
      id:1,
      path: "/login",  
      text: "Login"
    }
  ]