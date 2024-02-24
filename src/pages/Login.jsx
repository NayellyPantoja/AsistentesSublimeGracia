import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import "../styles/App.css";
import {
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import imgLogin from "../assets/Login/Asistentes.jpg";
import { db, login } from "../firebaseConfig";
import {collection, doc, getDoc} from "firebase/firestore";
import {AuthContext} from "../context/AuthContext"
import Swal from "sweetalert2";

const Login = () => {

  const {handleLogin} = useContext(AuthContext)


  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const [userCredential, setUserCredential] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserCredential((prevUserCredential) => ({ ...userCredential, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(userCredential);
      
      if(res.user){
        const userCollection = (collection(db, "users"));
        const userRef = doc(userCollection, res.user.uid);
        const userDoc = await getDoc(userRef)
        let finalyUser = {
          email: res.user.email,
          rol: userDoc.data().rol,
          nombre: userDoc.data().nombre,
          apellido: userDoc.data().apellido
        }
        console.log(finalyUser)
        handleLogin(finalyUser)
        {finalyUser.rol === "user" ? navigate("/bienvenido") : navigate("/AgregarAsistente")}
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Usuario o contraseña incorrectos.",
      });
    }
  };

  

  return (
    <div className="containerForm">
      <form className="cardContainer" onSubmit={handleSubmit}>
        <img className="loginImage " src={imgLogin} />
        <div className="formulario">
          <div className="textLogin">
            <h1>BIENVENIDO DE NUEVO</h1>
          </div>

          <Grid item xs={10} md={12} paddingBottom={"2rem"}>
            <TextField
              name="email"
              label="Email"
              fullWidth
              onChange={handleChange}
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
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
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
                label="Contraseña"
              />
            </FormControl>
          </Grid>
          <div className="forgetPassword">
            <Link to={"/olvideMiContraseña"}>¿Olvidaste tu contraseña?</Link>
          </div>

          <div className="containerBoton">
            <button type="submit" className="loginBoton">
              INICIAR SESIÓN
            </button>
            <Link className="registro" to={"/registro"}>
              Crear cuenta nueva
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;