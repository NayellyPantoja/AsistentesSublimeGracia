import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Box, Modal } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faUser } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ModalDetalleNuevos = ({ open, handleClose, selectedAsistente }) => {
  const { style } = useContext(AuthContext);
  const year = dayjs().year();
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // Array con los números de mes del 1 al 12
  const diasAsistidos = selectedAsistente?.diasAsistidos;

  const contarAsistenciasPorMes = (diasAsistidos, year, month) => {
    return diasAsistidos?.filter((dia) => {
      if (typeof dia !== "string") {
        return false; // Si no es una cadena, no lo incluimos en el filtro
      }
      const [yearDia, monthDia] = dia.split("-");
      return parseInt(yearDia) === year && parseInt(monthDia) === month;
    }).length;
  };

  const sundaysPerMonth = months.map((month) => {
    const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
    let numberOfSundays = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = dayjs(`${year}-${month}-${day}`);
      if (date.day() === 0) {
        // 0 representa el domingo
        numberOfSundays++;
      }
    }

    const numberOfAsistencias = contarAsistenciasPorMes(
      diasAsistidos,
      year,
      month
    );
    const monthName = format(new Date(year, month - 1, 1), "MMMM", {
      locale: es,
    });
    return { monthName, numberOfSundays, numberOfAsistencias };
  });

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...style, display: "flex", flexDirection: "column" }}>
        <FontAwesomeIcon
          icon={faXmark}
          onClick={handleClose}
          className="closeModal"
        />

        <table className="table detalleNuevo">
          <tbody>
            <tr>
              <td className="containerIcon">
                <FontAwesomeIcon className="iconUser" icon={faUser} />
              </td>
            </tr>
          </tbody>
          <thead>
            <tr className="contenedorTituloTabla">
              <th className="encabezadoTabla nombre">NOMBRE</th>
              {selectedAsistente?.edad && (
                <th className="encabezadoTabla">EDAD</th>
              )}
              {selectedAsistente?.telefono && (
                <th className="encabezadoTabla">TELEFONO</th>
              )}
              {selectedAsistente?.barrio && (
                <th className="encabezadoTabla">BARRIO</th>
              )}
              {selectedAsistente?.direccion && (
                <th className="encabezadoTabla">DIRECCIÓN</th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr className="contenedorInfoTabla">
              <td className="contenidoTabla">{`${selectedAsistente?.nombre} ${selectedAsistente?.apellido}`}</td>
              <td className="contenidoTabla ">{selectedAsistente?.edad}</td>
              <td className="contenidoTabla ">{selectedAsistente?.telefono}</td>
              <td className="contenidoTabla ">{selectedAsistente?.barrio}</td>
              <td className="contenidoTabla ">
                {selectedAsistente?.direccion}
              </td>
            </tr>
          </tbody>
        </table>

        <table className="table detalleAsistencia">
          <thead>
            <tr className="contenedorTituloTabla">
              <th className="encabezadoTabla nombre">MES</th>
              <th className="encabezadoTabla nombre">DOMINGOS DEL MES</th>
              <th className="encabezadoTabla nombre">DOMINGOS ASISTIDOS</th>
            </tr>
          </thead>
          <tbody className="contenedor datosNuevo">
            {sundaysPerMonth?.map((item, index) => (
              <tr key={index} className="contenedorBodyMeses">
                <td className="contenidoTabla">
                  {item?.monthName.toUpperCase()}
                </td>
                <td className="contenidoTabla">{item?.numberOfSundays}</td>
                <td className="contenidoTabla">{item?.numberOfAsistencias}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Modal>
  );
};

export default ModalDetalleNuevos;
