import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import ModalDetalleNuevos from "../modal/ModalDetalleNuevos";

const Nuevos = () => {
  const [selectedAsistente, setSelectedAsistente] = useState(null);
  const [fecha, setFecha] = useState("");
  const [asistentes, setAsistentes] = useState([]);
  const [asistentesRender, setAsistentesRender] = useState([]);
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1)
  );
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    if (fecha) {
      const personasAsistieron = asistentes?.filter(
        (persona) =>
          persona?.diasAsistidos?.includes(fecha) &&
          persona.diasAsistidos.length === 1
      );
      console.log(personasAsistieron);
      setAsistentesRender(personasAsistieron);
    } else {
      setAsistentesRender(asistentes);
    }
  }, [fecha, asistentes]);

  useEffect(() => {
    const dataFetch = async () => {
      try {
        let asistenteCollection = collection(db, "asistentes");
        const resAsistente = await getDocs(asistenteCollection);
        let newRes = resAsistente.docs.map((asistente) => {
          return { ...asistente.data(), id: asistente.id };
        });
        setAsistentes(newRes);
      } catch (error) {
        console.log(error);
      }
    };
    dataFetch();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (asistente) => {
    setSelectedAsistente(asistente);
    setOpen(true);
  };

  return (
    <div className="containerTable">
      <div className="containerFiltroRegistro">
        Buscar por fecha de registro
        <input
          id="fecha"
          type="date"
          className="fechaAsistencia"
          value={fecha}
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
                  textAlign: "center",
                }}
              >
                Visitas
              </TableCell>
              <TableCell
                align="left"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bolder",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                Detalle
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asistentesRender.length >= 1 ? (
              asistentesRender?.map((asistente) => (
                <TableRow
                  key={asistente?.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    align="left"
                    style={{ fontSize: "1.2rem", textTransform: "uppercase" }}
                  >
                    {`${asistente?.nombre} ${asistente?.apellido}`}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    align="left"
                    style={{ fontSize: "1.2rem", textAlign: "center" }}
                  >
                    {asistente?.diasAsistidos?.length}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    align="left"
                    style={{
                      fontSize: "1.2rem",
                      textTransform: "uppercase",
                      textAlign: "center",
                    }}
                  >
                    <Visibility onClick={() => handleOpen(asistente)} />
                    {open && (
                      <ModalDetalleNuevos
                        open={open}
                        handleClose={handleClose}
                        selectedAsistente={selectedAsistente}
                        asistentes={asistentes}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell> No se encontraron registros</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="totalAsistentes">
        Número de asistentes registrados: {asistentes.length}
      </div>
    </div>
  );
};

export default Nuevos;
