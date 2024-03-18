import {
    faHouse,
    faPersonPraying,
    faVideo,
    faArrowRightFromBracket,
    faChartLine,
    faEye,
    faCheck,
    faList
  } from "@fortawesome/free-solid-svg-icons";
  
  export const routes = [
    {
      id: 1,
      path: "/AgregarAsistente",  
      text: "Registrar visitantes", 
      icon:  faList },
    {
      id: 2,
      path: "/AsistenciaVisitantes",
      text: "Tomar asistencia",
      icon: faCheck ,
    },
    { 
      id: 3,
      path: "/RegularidadVisitantes", 
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