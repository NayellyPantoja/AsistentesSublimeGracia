import { Button, Grid, TextField } from "@mui/material";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import "../styles/App.css";
import { useContext, useState } from "react";
import { db, uploadFile } from "../firebaseConfig";
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
  const { user } = useContext(AuthContext);
  const adminNuevos = import.meta.env.VITE_ADMINNUEVOS;
  const adminProspMiembros = import.meta.env.VITE_ADMINPROSPMIEMBROS;
  const [isChange, setIsChange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const fechaActual = new Date();
  const year = fechaActual.getFullYear();
  const month = String(fechaActual.getMonth() + 1).padStart(2, "0");
  const day = String(fechaActual.getDate()).padStart(2, "0");
  const fechaAsistencia = `${year}-${month}-${day}`;
  const [file, setFile] = useState(null);
  const [imgCargada, setImgCargada] = useState(false);
  console.log("imagenCargada: ", imgCargada)
  console.log("file: ", file)
  
  const [nuevo, setNuevo] = useState(() => {
    const baseState = {
      nombre: "",
      apellido: "",
      direccion: "",
      barrio: "",
      telefono: "",
      edad: "",
      nota: "",
      img: "",
      registrador: user.nombre + " " + user.apellido,
      diasAsistidos: user.rol === adminNuevos || user.rol !== adminProspMiembros ? [fechaAsistencia] : [],
    };
  
    if (user.rol === adminProspMiembros) {
      baseState.inasistencias = [];
    }
  
    return baseState;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevo(() => ({
      ...nuevo,
      [name]: value.toUpperCase(),
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
      return;
    }
    // Verificar si el nombre y apellido ya existen en la base de datos
    const registroCollection =
      user.rol === adminNuevos
        ? collection(db, "asistentes")
        : user.rol === adminProspMiembros
        ? collection(db, "prospectosMiembros")
        : collection(db, "asistentes");
    const q = query(
      registroCollection,
      where("nombre", "==", nuevo.nombre),
      where("apellido", "==", nuevo.apellido)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ya existe un asistente con el mismo nombre y apellido en la base de datos.",
      });
      return;
    }

    setLoading(true);
    if (user.rol === adminNuevos) {
      const nuevosCollection = collection(db, "asistentes");
      await setDoc(doc(nuevosCollection), nuevo);
    }
    if (user.rol === adminProspMiembros) {
      const prospMiembrosCollection = collection(db, "prospectosMiembros");
      await setDoc(doc(prospMiembrosCollection), nuevo);
    }
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
      edad: "",
      nota: "",
      registrador: user.nombre + " " + user.apellido,
      img: "",
      diasAsistidos:
        user.rol === adminNuevos
          ? [new Date().toISOString().split("T")[0]]
          : user.rol === adminProspMiembros
          ? []
          : [new Date().toISOString().split("T")[0]],
    });
    setTimeout(() =>{
      window.location.reload();
    }, 2500)
    
    isChange;
  };
  const handleImage = async () => {
    setLoadingImage(true);
    try {
      let url = await uploadFile(file);
      setNuevo({ ...nuevo, img: url });
      setLoadingImage(false);
      setImgCargada(true);
      Swal.fire({
        icon: "success",
        text: "Imagen cargada con éxito.",
      });
    } catch (error) {
      console.log(error);
    }
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
              <h1>
                {user.rol === adminNuevos
                  ? "REGISTRAR VISITANTES"
                  : "REGISTRAR PROSPECTO MIEMBRO"}
              </h1>
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
                name="edad"
                label="Edad"
                value={nuevo.edad}
                fullWidth
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
                label="Telefono"
                value={nuevo.telefono}
                fullWidth
              />
            </Grid>
            <Grid item xs={10} md={12} paddingBottom={"2rem"}>
              <TextField
                onChange={handleChange}
                name="nota"
                label="Nota"
                value={nuevo.nota}
                fullWidth
                multiline
                rows={6}
              />
            </Grid>
            {user.rol === adminProspMiembros && (
              <>
                <TextField
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {file && !imgCargada && (
                  <Button
                    variant="contained"
                    className="buttonEdit"
                    onClick={handleImage}
                  >
                    {loadingImage ? "Cargando..." : "Cargar"}
                  </Button>
                )}
              </>
            )}

            <div className="containerBoton">
              {loading ? (
                <div className="loginBoton disable"> Cargando...</div>
              ) : (
                <button type="submit" className="loginBoton">
                  Registrar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default FormAddPerson;
