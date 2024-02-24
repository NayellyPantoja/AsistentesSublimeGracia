import Footer from "../footer/Footer"
import Header from "../header/Header"


const SinPermisos = () => {
  return (
    <>
    <Header/>
    <div className="register-confirm-container">
        <div className="containerText">
        <h2 className="bienvenido">Bienvenido(a)!</h2>
        <p className="texto">
        Gracias por registrarte. En este momento no estás habilitado para gestionar este sitio, por favor espera a que uno de nuestros administradores te otorgue permisos.
      </p>
        </div>
    </div>
    <Footer/>
    </>
    
    
  )
}

export default SinPermisos
