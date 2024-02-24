import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../styles/App.css";
import { Suspense } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import DashboardPage from "../pages/DashboardPage";
import { FadeLoader } from "react-spinners";
import FormAddPerson from "../pages/FormAddPerson";
import AsistenciaNuevosPage from "../pages/AsistenciaNuevosPage";
import RegularidadNuevos from "../pages/RegularidadNuevos";
import ProtectedAdmin from "./ProtectedAdmin";
import SinPermisos from "../components/usuariosUser/SinPermisos";

function AppRouter() {
  return (
    <Suspense
      fallback={
        <div className="containerLoader fallback">
          <FadeLoader color="#7CAC41" />
        </div>
      }
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/registro" element={<Register />}/>
          <Route path="/olvideMiContraseña" element={<ForgotPassword />}/>
          <Route path="/bienvenido" element={<SinPermisos />}/>
          
          <Route element={<ProtectedAdmin/>}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="/AgregarAsistente" element={<FormAddPerson/>}/>
          <Route path="/AsistenciaVisitantes" element={<AsistenciaNuevosPage/>}/>
          <Route path="/RegularidadVisitantes" element={<RegularidadNuevos/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

export default AppRouter;
