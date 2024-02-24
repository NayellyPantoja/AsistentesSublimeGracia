import { useEffect, useState } from "react";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Checkbox,
  Button,
  MenuItem,
} from "@mui/material";
import Swal from "sweetalert2";

const AsistenciaNuevos = () => {
  const [asistentesSeleccionados, setAsistentesSeleccionados] = useState([]);
  const [registradorSeleccionado, setRegistradorSeleccionado] = useState(null);
  const [asistentesFiltrados, setAsistentesFiltrados] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [asistentes, setAsistentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    setIsChange(false);
    const dataFetch = async () => {
      try {
        let asistenteCollection = collection(db, "asistentes");
        const resAsistente = await getDocs(asistenteCollection);
        let newRes = resAsistente.docs.map((asistente) => {
          return { ...asistente.data(), id: asistente.id };
        });
        setAsistentes(newRes);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    dataFetch();
  }, [isChange]);

  useEffect(() => {
    if (registradorSeleccionado) {
      const filtroDeAsistentes = asistentes.filter(
        (asistente) => asistente.registrador === registradorSeleccionado
      );
      setAsistentesFiltrados(filtroDeAsistentes);
    } else {
      setAsistentesFiltrados(asistentes);
    }
  }, [asistentes, registradorSeleccionado]);

  const handleRegistradorChange = (event) => {
    setRegistradorSeleccionado(event.target.value);
  };

  const handleSelectAsistente = (asistente) => {
    if (asistentesSeleccionados.includes(asistente.id)) {
      setAsistentesSeleccionados(
        asistentesSeleccionados.filter((id) => id !== asistente.id)
      );
    } else {
      setAsistentesSeleccionados([...asistentesSeleccionados, asistente.id]);
    }
  };

  const handleFinalizar = async () => {
    if (!fecha) {
      alert("Debe seleccionar una fecha.");
      return;
    }

    try {
      const batch = writeBatch(db);
      asistentesSeleccionados.forEach((asistenteId) => {
        const asistente = asistentes.find((a) => a.id === asistenteId);
        if (asistente) {
          const updatedDiasAsistidos = [...asistente.diasAsistidos, fecha];
          const asistenteRef = doc(db, "asistentes", asistente.id);
          batch.update(asistenteRef, { diasAsistidos: updatedDiasAsistidos });
        }
      });
      await batch.commit();
      Swal.fire({
        icon: "success",
        title: "Asistencia registrada exitosamente",
        text: "La asistencia ha sido registrada con éxito.",
      });
      setIsChange(!isChange); // Para volver a cargar la tabla
      setAsistentesSeleccionados([]); // Limpiar la lista de asistentes seleccionados
    } catch (error) {
      console.error("Error updating document: ", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un problema al intentar registrar la asistencia. Por favor, inténtalo de nuevo más tarde.",
      });
    }
  };

  return (
    <div className="containerTable">
      

      <div className="containerFiltros">
      <TextField
        id="registrador"
        select
        label="Registrador"
        value={registradorSeleccionado || ""}
        onChange={handleRegistradorChange}
        className="registradorAsistencia"
      >
        {asistentes
          .map((asistente) => asistente.registrador)
          .filter((value, index, self) => self.indexOf(value) === index) // Filtra duplicados
          .map((registrador) => (
            <MenuItem key={registrador} value={registrador}>
              {registrador}
              {console.log(
                "registradorSeleccionado: ",
                registradorSeleccionado
              )}
            </MenuItem>
          ))}
      </TextField>
        <TextField
          id="fecha"
          label="Fecha"
          type="date"
          className="fechaAsistencia"
          defaultValue={new Date().toISOString().split("T")[0]}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bolder",
                  textTransform: "uppercase",
                }}
              >
                Nombre
              </TableCell>

              <TableCell
                align="left"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bolder",
                  textTransform: "uppercase",
                  textAlign: "center"
                }}
              >
                Asistencia
              </TableCell>
              <TableCell
                align="left"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bolder",
                  textTransform: "uppercase",
                  textAlign: "center"
                }}
              >
                Registrado por
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asistentesFiltrados.map((asistente) => (
              <TableRow
                key={asistente.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  align="left"
                  style={{ fontSize: "1.2rem", textTransform: "uppercase" }}
                >
                  {`${asistente.nombre} ${asistente.apellido}`}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  align="left"
                  style={{ fontSize: "1.2rem", textAlign: "center" }}
                  onClick={() => handleSelectAsistente(asistente)}
                >
                  <Checkbox
                    checked={asistentesSeleccionados.includes(asistente.id)}
                    disabled={!fecha}
                  />
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  align="left"
                  style={{ fontSize: "1.2rem", textTransform: "uppercase",textAlign: "center" }}
                >
                  {asistente.registrador}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={handleFinalizar} className="buttonAsistenciaNuevos">
        Finalizar
      </Button>
    </div>
  );
};

export default AsistenciaNuevos;
