import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ routes, isLogged, user, adminNuevos, adminProspMiembros, sidebar, handleLogout }) => {
  const location = useLocation();

  return (
    <>
      {routes.map((ruta) => {
        const isAdmin = isLogged && (user.rol === adminNuevos || user.rol === adminProspMiembros);
        const isVisitorRoute = ["Registrar visitantes", "Tomar asistencia", "Ver asistencia"].includes(ruta.text);
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
              <span> {user.rol=== adminProspMiembros ? (ruta.text === "Registrar visitantes" ? "Registrar prospecto miembro" : ruta.text) : ruta.text}</span>
            </Link>
          );
        }

        return null;
      })}
    </>
  );
};

export default Navbar;