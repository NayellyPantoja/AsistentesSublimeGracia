import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ routes, isLogged, user, admin, sidebar, handleLogout }) => {
  const location = useLocation();

  return (
    <>
      {routes.map((ruta) => {
        const isAdmin = isLogged && user.rol === admin;
        const isVisitorRoute = ["Registro de visitantes", "Asistencia de visitantes", "Regularidad de visitantes"].includes(ruta.text);
        if (
          (isAdmin && isLogged && ruta.text !== "Bienvenido") ||
          (!isAdmin && isLogged && ruta.text !== "Dashboard" && !isVisitorRoute) ||
          (!isLogged && ruta.text !== "Dashboard" && ruta.text !== "Cerrar sesión" && !isVisitorRoute)
        ) {
          return (
            <Link
              className={`itemMenu ${
                location.pathname === ruta.path ? "activeLink" : ""
              } ${sidebar ? "sidebarOpen" : ""}`}
              to={ruta.path}
              key={ruta.id}
              onClick={ruta.text === "Cerrar sesión" ? handleLogout : null}
            >
              <FontAwesomeIcon
                icon={ruta.icon}
                className={`iconMenu ${sidebar ? "sidebarOpen" : ""} ${location.pathname === ruta.path ? "activeLink" : ""}`}
              ></FontAwesomeIcon>
              <span> {ruta.text}</span>
            </Link>
          );
        }

        return null;
      })}
    </>
  );
};

export default Navbar;