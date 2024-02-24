import {
    faHouse,
    faPersonPraying,
    faVideo,
    faArrowRightFromBracket,
    faChartLine
  } from "@fortawesome/free-solid-svg-icons";
  
  export const routes = [
    {
      id: 1,
      path: "/AgregarAsistente",  
      text: "Registro de visitantes", 
      icon:  faHouse },
    {
      id: 2,
      path: "/AsistenciaVisitantes",
      text: "Asistencia de visitantes",
      icon: faPersonPraying ,
    },
    { 
      id: 3,
      path: "/RegularidadVisitantes", 
      text: "Regularidad de visitantes",
      icon: faVideo  
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
    path: "/",  
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