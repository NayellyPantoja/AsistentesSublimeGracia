import { useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

const Nuevos = () => {
  const { user, adminNuevos, adminProspMiembros } = useContext(AuthContext);
  const [selectedAsistente, setSelectedAsistente] = useState(null);
  const [fecha, setFecha] = useState("");
  const [asistentes, setAsistentes] = useState([]);
  const [asistentesOrdenados, setAsistentesOrdenados] = useState([]);
  const [open, setOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1)
  );
  const [endDate, setEndDate] = useState(new Date());
  const [asistentesRender, setAsistentesRender] = useState([]);
  const [nombreAsistenteSeleccionado, setNombreAsistenteSeleccionado] =
    useState("");
  console.log(nombreAsistenteSeleccionado);
  

  useEffect(() => {
    const ordenados = [...asistentes].sort(
      //(a, b) => b.diasAsistidos.length - a.diasAsistidos.length
      (a, b) => {
        const lenA = Array.isArray(a.diasAsistidos) ? a.diasAsistidos.length : 0;
        const lenB = Array.isArray(b.diasAsistidos) ? b.diasAsistidos.length : 0;
        return lenB - lenA;}
    );
    setAsistentesOrdenados(ordenados);
  }, [asistentes]);

  useEffect(() => {
    const dataFetch = async () => {
      try {
        let asistenteCollection =
          user.rol === adminNuevos
            ? collection(db, "asistentes")
            : collection(db, "prospectosMiembros");
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

  useEffect(() => {
    if (fecha) {
      const personasAsistieron = asistentes?.filter(
        (persona) =>
          persona?.diasAsistidos?.includes(fecha) &&
          persona.diasAsistidos.length === 1
      );
      console.log(personasAsistieron);
      setAsistentesOrdenados(personasAsistieron);
    }
  }, [fecha, asistentes]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (asistente) => {
    setSelectedAsistente(asistente);
    setOpen(true);
  };

  const handleCloseNombreAsistSeleccionado = () => {
    setNombreAsistenteSeleccionado("");
  };


  return (
    <div className="containerTable">
      <div className="containerFiltros">
        <div className="sectionFiltros">
          <div className="containerFiltroXNombre">
            {user.rol === adminNuevos ? "Buscar por nombre del asistente" : "Buscar por nombre del prospecto miembro"}
            <Select
              id="asistente"
              className="filtrarNombre"
              value={asistentesOrdenados?.find(
                (asistente) => asistente?.id === nombreAsistenteSeleccionado
              )}
              onChange={(selectedOption) => {
                setNombreAsistenteSeleccionado(selectedOption),
                  setIsChange(!isChange);
              }}
              options={asistentesOrdenados.map((asistente) => ({
                value: asistente?.id,
                label: `${asistente?.nombre} ${asistente?.apellido}`,
              }))}
            />
            {nombreAsistenteSeleccionado && (
              <FontAwesomeIcon
                icon={faXmark}
                onClick={handleCloseNombreAsistSeleccionado}
                className="closeFiltroNombre"
              />
            )}
          </div>
          {user.rol === adminNuevos &&
          <div className="contentIndividualFiltro">
          Buscar por fecha de registro
          <input
            id="fecha"
            type="date"
            className="fechaAsistencia"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
        }
          
        </div>
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
                {user.rol === adminNuevos ? "Visitas" : "Asistencias"}
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
            {nombreAsistenteSeleccionado ? (
              asistentesOrdenados
                .filter(
                  (asistente) =>
                    asistente.id === nombreAsistenteSeleccionado.value
                )
                .map((asistente) => (
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
            ) : asistentesOrdenados.length >= 1 ? (
              asistentesOrdenados?.map((asistente) => (
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
        Asistentes registrados: {asistentes.length}
      </div>
    </div>
  );
};

export default Nuevos;
