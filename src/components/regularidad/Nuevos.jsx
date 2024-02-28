import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../../firebaseConfig";
import {  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import ModalDetalleNuevos from "../modal/ModalDetalleNuevos";

const Nuevos = () => {
  const [selectedAsistente, setSelectedAsistente] = useState(null);
  const [asistentes, setAsistentes] = useState([]);
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1));
  const [endDate, setEndDate] = useState(new Date());

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

  const handleVerDetalle = (asistente) => {
    setSelectedAsistente(asistente);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (asistente) => {
    setSelectedAsistente(asistente);
    setOpen(true);
  };

  return (
    <div className="containerTable">
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
                Visitas
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
                Detalle 
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asistentes?.map((asistente) => (
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
                  style={{ fontSize: "1.2rem", textAlign: "center"}}
                >
                  {asistente?.diasAsistidos.length}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  align="left"
                  style={{ fontSize: "1.2rem", textTransform: "uppercase", textAlign: "center"}}
                >
                  <Visibility onClick={() =>handleOpen(asistente)}/>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );
};

export default Nuevos;