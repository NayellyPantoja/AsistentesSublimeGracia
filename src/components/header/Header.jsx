import { Link } from "react-router-dom";
import logoImagen from "../../assets/Logo/logoImagen.png";
import logoLetras from "../../assets/Logo/logoLetras.png";
import "../../styles/App.css";
import { routes } from "../../routes/routes";
import { useContext, useEffect, useState } from "react";
import BotonNavbar from "./BotonNavbar";
import { logout } from "../../firebaseConfig";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "./Navbar";

const Header = () => {
  const { logoutContext, isLogged, user } = useContext(AuthContext);
  const admin = import.meta.env.VITE_ADMIN;
  const [scrolled, setScrolled] = useState(false);
  const [pantalla, setPantalla] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll, { passive: true });
    };
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      const esAnchoMayor = window.innerWidth > 670;
      setPantalla(esAnchoMayor);
    };

    handleWindowResize();

    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const handleLogout = () => {
    logoutContext();
    logout();
  };

  return (
    <div className={`containerHeader ${scrolled || location.pathname === "/dashboard" ? "scrolled" : ""}`}>
      <div className="containerLogo">
        <Link to="/AgregarAsistente">
          <img className="logoImagen" src={logoImagen} alt="Logo Sublime Gracia" />
          <img className="logoLetras" src={logoLetras} alt="Logo Sublime Gracia" />
        </Link>
      </div>

      <div className={`containerMenu ${sidebar ? "sidebarOpen" : ""}`}>
        {(pantalla || sidebar) && (
          <>
            {sidebar && <BotonNavbar sidebar={sidebar} setSidebar={setSidebar} />}
            <Navbar
              routes={routes}
              isLogged={isLogged}
              user={user}
              admin={admin}
              sidebar={sidebar}
              handleLogout={handleLogout}
            />
          </>
        )}
        {!pantalla && <BotonNavbar sidebar={sidebar} setSidebar={setSidebar} />}
      </div>
    </div>
  );
};

export default Header;