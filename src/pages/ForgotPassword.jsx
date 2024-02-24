import {
  Grid,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { forgotPassword } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const res = await forgotPassword(email);
      navigate("/")
    }

    const handleBack = () =>{
      navigate("/")
    }
    
return (
  <div className="containerForm">
    <form onSubmit={handleSubmit} className="cardContainer register">
      <div className="formulario register">
        <div className="textLogin">
          <h1>¿Olvidaste tu contraseña?</h1>
        </div>

        <Grid item xs={10} md={12} paddingBottom={"2rem"}>
          <TextField  name="email" onChange={(e) => setEmail(e.target.value)}  label="Email" fullWidth />
        </Grid>

        <div className="containerBoton">
          <button type="submit" className="loginBoton">
            RECUPERAR
          </button>
          <button type="button" className="loginBoton" onClick={handleBack}>
          REGRESAR
          </button>
        </div>
      </div>
    </form>
  </div>
)
}

export default ForgotPassword