import { FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { useState } from "react";
import { db, signUp } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { setDoc, doc, query, collection, where, getDocs } from "firebase/firestore";
import Swal from "sweetalert2";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const [user, setUser] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser((prevUser) => ({ ...prevUser, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    if (!user.nombre || !user.apellido || !user.email || !user.password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, completa todos los campos.",
      });
      return;
    }

    // Validar que el correo tenga un formato válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "El correo electrónico no tiene un formato válido.",
      });
      return;
    }

    // Validar que la contraseña cumpla con los requisitos
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(user.password)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La contraseña debe tener al menos una mayúscula, ser mayor a 6 caracteres y tener al menos un signo.",
      });
      return;
    }

    const asistentesCollection = collection(db, "users");
    const q = query(
      asistentesCollection,
      where("nombre", "==", user.nombre),
      where("apellido", "==", user.apellido)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Si ya existe un usuario con el mismo nombre y apellido, mostrar un SweetAlert de error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ya existe un usuario registrado con el mismo nombre y apellido.",
      });
      return; // Detener la ejecución de la función
    }

    // Registro de usuario
    setLoading(true)
    let res = await signUp(user);
    if (res.user.uid) {
      await setDoc(doc(db, "users", res.user.uid), {
        rol: "user",
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
      });
    }
    setLoading(false)
    Swal.fire({
      icon: "succes",
      title: "succes",
      text: "Registro exitoso",
    });
    navigate("/");
  };

  return (
    <div className="containerForm">
      <form onSubmit={handleSubmit} className="cardContainer register">
        <div className="formulario register">
          <div className="textLogin">
            <h1>¡REGISTRATE AHORA!</h1>
          </div>

          <Grid item xs={10} md={12} paddingBottom={"2rem"}>
            <TextField
              onChange={handleChange}
              name="nombre"
              label="Nombre*"
              sx={{ width: "48%", marginRight: "4%" }}
            />
            <TextField
              onChange={handleChange}
              name="apellido"
              label="Apellido*"
              sx={{ width: "48%" }}
            />
          </Grid>
          <Grid item xs={10} md={12} paddingBottom={"2rem"}>
            <TextField
              onChange={handleChange}
              name="email"
              label="Email*"
              fullWidth
            />
          </Grid>
          <Grid item xs={10} md={12} paddingBottom={"2rem"}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">
                Contraseña
              </InputLabel>
              <OutlinedInput
                name="password"
                onChange={handleChange}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      aria-label="toggle password visibility"
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff color="primary" />
                      ) : (
                        <Visibility color="primary" />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Contraseña*"
              />
            </FormControl>
          </Grid>

          <div className="containerBoton">
            
            <button type="submit" className="loginBoton">
              {loading ? "CARGANDO..." : "REGISTRARTE"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;