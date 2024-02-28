import { Grid, TextField } from "@mui/material";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import "../styles/App.css";
import { useContext, useState } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

const FormAddPerson = () => {
  const [isChange, setIsChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const fechaActual = new Date();
  const year = fechaActual.getFullYear();
  const month = String(fechaActual.getMonth() + 1).padStart(2, "0"); 
  const day = String(fechaActual.getDate()).padStart(2, "0");

  const fechaAsistencia = `${year}-${month}-${day}`;
  const [nuevo, setNuevo] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    barrio: "",
    telefono: "",
    registrador: user.nombre + " " + user.apellido,
    diasAsistidos: [fechaAsistencia],
  });


  const handleChange = (e) => {
    setNuevo(() => ({
      ...nuevo,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nuevo.nombre || !nuevo.apellido) {
      Swal.fire({
        icon: "warning",
        title: "Error",
        text: "Por favor, completa ingresa nombre y apellido.",
      });
      return; // Detener la ejecución de la función
    }

    // Verificar si el nombre y apellido ya existen en la base de datos
    const asistentesCollection = collection(db, "asistentes");
    const q = query(
      asistentesCollection,
      where("nombre", "==", nuevo.nombre),
      where("apellido", "==", nuevo.apellido)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si ya existe un asistente con el mismo nombre y apellido, mostrar un SweetAlert de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ya existe un asistente con el mismo nombre y apellido en la base de datos.",
      });
      return; // Detener la ejecución de la función
    }

    // Si no existe, crear el nuevo asistente
    setLoading(true);
    const nuevosCollection = collection(db, "asistentes");
    await setDoc(doc(nuevosCollection), nuevo);
    setIsChange(true);
    setLoading(false);
    Swal.fire({
      icon: "success",
      title: "Registro exitoso",
      text: "Tu registro ha sido completado con éxito.",
    });
    setNuevo({
      nombre: "",
      apellido: "",
      direccion: "",
      barrio: "",
      telefono: "",
      registrador: user.nombre + " " + user.apellido,
      diasAsistidos: [new Date().toISOString().split("T")[0]],
    });
    isChange;
  };

  return (
    <>
      <Header />
      <div className="containerForm">
        <form
          onSubmit={handleSubmit}
          className="cardContainer register nuevosAsistentes"
        >
          <div className="formulario register">
            <div className="textLogin">
              <h1>REGISTRAR VISITANTES</h1>
            </div>

            <Grid item xs={10} md={12} paddingBottom={"2rem"}>
              <TextField
                onChange={handleChange}
                name="nombre"
                label="Nombre*"
                value={nuevo.nombre}
                sx={{ width: "48%", marginRight: "4%" }}
              />
              <TextField
                onChange={handleChange}
                name="apellido"
                label="Apellido*"
                value={nuevo.apellido}
                sx={{ width: "48%" }}
              />
            </Grid>
            <Grid item xs={10} md={12} paddingBottom={"2rem"}>
              <TextField
                onChange={handleChange}
                name="direccion"
                label="Direccion"
                value={nuevo.direccion}
                fullWidth
              />
            </Grid>
            <Grid item xs={10} md={12} paddingBottom={"2rem"}>
              <TextField
                onChange={handleChange}
                name="barrio"
                label="Barrio"
                value={nuevo.barrio}
                fullWidth
              />
            </Grid>
            <Grid item xs={10} md={12} paddingBottom={"2rem"}>
              <TextField
                onChange={handleChange}
                name="telefono"
                label="Telefono*"
                value={nuevo.telefono}
                fullWidth
              />
            </Grid>

            <div className="containerBoton">
              <button type="submit" className="loginBoton">
                {loading ? "CARGANDO..." : "REGISTRAR"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default FormAddPerson;
