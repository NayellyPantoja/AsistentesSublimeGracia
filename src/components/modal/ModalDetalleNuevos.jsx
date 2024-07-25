import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Box, Modal } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faUser, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import EChartsReact from "echarts-for-react";
import { Visibility } from "@mui/icons-material";
import ModalAsistencias from "./ModalAsistencias";
import ModalInasistencias from "./ModalInasistencias";

const ModalDetalleNuevos = ({ open, handleClose, selectedAsistente}) => {
  const { style, user, adminNuevos, adminProspMiembros} =
    useContext(AuthContext);
    const [openAsistencias, setOpenAsistencias] = useState(false)
    const [openInasistencias, setOpenInasistencias] = useState(false)
    const [fechasAsistidas, setFechasAsistidas] = useState(selectedAsistente?.diasAsistidos?.map(
      (asistencia) => asistencia || [])
    );
    const [fechasInasistidas, setFechasInasistidas] = useState(selectedAsistente?.inasistencias?.map(
      (inasistencia) => inasistencia.fecha || [])
    );

    if (!selectedAsistente) {
      return null; 
    }
    // console.log(fechasInasistidas)
  
  const asistencias = selectedAsistente?.diasAsistidos  ? fechasAsistidas.length : 0;
  const inasistencias = selectedAsistente?.inasistencias
    ? fechasInasistidas.length
    : 0;
  const restantes = 12 - asistencias - inasistencias;

  const totalDias = 12; // Días totales a evaluar
  const porcentajeAsistencias = Math.round((asistencias / totalDias) * 100);
  const porcentajeInasistencias = Math.round((inasistencias / totalDias) * 100);
  const porcentajeRestantes = Math.round((restantes / totalDias) * 100);

  
  const year = dayjs().year();
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // Array con los números de mes del 1 al 12
  const diasAsistidos = selectedAsistente?.diasAsistidos || [];

  const contarMotivosInasistencia = (inasistencias) => {
    return inasistencias.reduce((acc, inasistencia) => {
      const { motivo } = inasistencia;
      if (acc[motivo]) {
        acc[motivo]++;
      } else {
        acc[motivo] = 1;
      }
      return acc;
    }, {});
  };

  const convertirAFormatoSolicitado = (contados) => {
    return Object.entries(contados).map(([name, value]) => ({ value: Math.round(value * 100 / selectedAsistente.inasistencias.length), name }));
  };

  const motivosContados = contarMotivosInasistencia(
    selectedAsistente?.inasistencias || []
  );
  console.log(motivosContados)

  const datosEnFormatoSolicitado = convertirAFormatoSolicitado(motivosContados);

  const optionGeneral = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c}% ",
    },
    legend: {
      top: "5%",
      left: "center",
      bottom: "0",
    },
    series: [
      {
        name: "Porcentaje",
        type: "pie",
        radius: ["25%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 7,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: porcentajeRestantes, name: "Dias sin evaluar" },
          { value: porcentajeAsistencias, name: "Asistencias" },
          { value: porcentajeInasistencias, name: "Inasistencias" },
        ],
      },
    ],
  };

  const optionInasistencias = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c}% ",
    },
    legend: {
      top: "5%",
      left: "center",
      bottom: "0",
    },
    series: [
      {
        name: "Porcentaje",
        type: "pie",
        radius: ["25%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 7,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: datosEnFormatoSolicitado,
      },
    ],
  };
  // console.log(optionGeneral.series[0].data[0].value);
  // console.log(optionInasistencias.series[0].data);

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

  const handleOpenAsistencias = () => {
    setOpenAsistencias(true);
  };

  const handleCloseAsistencias = () => {
    setOpenAsistencias(false);
  };

  const handleOpenInasistencias = () => {
    setOpenInasistencias(true)
  }

  const handleCloseInasistencias = () => {
    setOpenInasistencias(false)
  }

  // useEffect(() =>{
  //   const asistenciaMasAntigua = selectedAsistente.diasAsistidos.reduce((minDate, fecha) => {
  //     return fecha < minDate ? fecha : minDate;
  //   }, selectedAsistente.diasAsistidos[0]);
  //   console.log("asistencia: ", asistenciaMasAntigua)

  //   const inasistenciaMasAntigua = selectedAsistente.inasistencias.reduce((minDate, inasistencia) => {
  //     return inasistencia.fecha < minDate ? inasistencia.fecha : minDate;
  //   }, selectedAsistente.inasistencias[0].fecha);
  //   console.log("inasistencia: ", inasistenciaMasAntigua)

  //   const fechaMasAntigua = asistenciaMasAntigua < inasistenciaMasAntigua ? asistenciaMasAntigua : inasistenciaMasAntigua;

  //   console.log("Fecha más antigua:", fechaMasAntigua);

  // },[selectedAsistente])

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

        {user.rol === adminProspMiembros && (
          <>
            <div className="containerProspMiembro">
              <div className="boxImage">
                <div className="content">
                  {selectedAsistente.img ? (
                    <img
                      src={selectedAsistente.img}
                      alt={`Foto del Asistente`}
                    />
                  ) : (
                    <FontAwesomeIcon className="iconUser" icon={faUser} />
                  )}
                </div>
              </div>
              <div className="containerInfoProspMiembros">
                <div className="infoProspMiembros nombre">{`${selectedAsistente?.nombre} ${selectedAsistente?.apellido}`}</div>
                <div className="infoProspMiembros">
                  Días a evaluar: <span>12</span>
                </div>
                <div className="infoProspMiembros">
                  Evaluados: <span>{asistencias + inasistencias}</span>
                </div>
                <div className="infoProspMiembros">
                  Asistencias: <span>{asistencias}</span>
                  <Visibility className="visibility" onClick={() => handleOpenAsistencias()} />
                  {openAsistencias && (
                        <ModalAsistencias
                          openAsistencias={openAsistencias}
                          handleCloseAsistencias={handleCloseAsistencias}
                          selectedAsistente={selectedAsistente}
                          fechasAsistidas={fechasAsistidas}
                          setFechasAsistidas={setFechasAsistidas}
                        />
                      )}
                </div>
                <div className="infoProspMiembros">
                  Inasistencias: <span>{inasistencias}</span>
                  <Visibility className="visibility" onClick={() => handleOpenInasistencias()} />
                  {openInasistencias &&
                  <ModalInasistencias
                  openInasistencias = {openInasistencias}
                  handleCloseInasistencias={handleCloseInasistencias}
                  selectedAsistente={selectedAsistente}
                  fechasInasistidas ={fechasInasistidas}
                  setFechasInasistidas={setFechasInasistidas}
                  />
                  }
                </div>
              </div>

            </div>
            <div className="containerGraficos">
            {(asistencias !== null && asistencias !== undefined) ||
            (inasistencias !== null && inasistencias !== undefined) ? (
              <>
                {optionGeneral.series[0].data[0].value !== 100 ? (
                  <>
                    <div className="contentGraficGeneral">
                      <EChartsReact
                        option={optionGeneral}
                        style={{
                          width: "100%",
                          boxShadow:
                            "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)",
                          height: "20rem",
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="sinRegistro"> <FontAwesomeIcon icon={faTriangleExclamation} className="warning"/>
                  No se registra información de asistencia para este usuario</div>
                )}
                {optionInasistencias.series[0].data.length >= 1 ? (
                  <>
                  
                    <div className="contentGraficGeneral">
                    <div className="graficTitle">MOTIVO DE INASISTENCIAS</div>
                      <EChartsReact
                        option={optionInasistencias}
                        style={{
                          width: "100%",
                          boxShadow:
                            "0 2px 4px rgba(0, 0, 0, .1), 0 8px 16px rgba(0, 0, 0, .1)",
                          height: "20rem",
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="sinRegistro"><FontAwesomeIcon icon={faTriangleExclamation} className="warning"/> No se encontraron motivos de inasistencias</div>
                )}
              </>
            ) : (
              <div className="sinRegistro"> <FontAwesomeIcon icon={faTriangleExclamation} className="warning"/> No se encontraron registros ni inasistencias</div>
            )}
            </div>
            
          </>
        )}

        <table
          className={
            user.rol === adminNuevos
              ? `table detalleNuevo`
              : "table detalleNuevoProspMiembros"
          }
        >
          <tbody>
            <tr>
              {user.rol === adminNuevos && (
                <td
                  className={
                    user.rol === adminNuevos
                      ? `containerIcon`
                      : `containerIconProspMiembros`
                  }
                >
                  <FontAwesomeIcon className="iconUser" icon={faUser} />
                </td>
              )}
            </tr>
          </tbody>
          {user.rol === adminNuevos && (
            <>
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
                  {selectedAsistente?.nota && (
                    <th className="encabezadoTabla">NOTA</th>
                  )}
                </tr>
              </thead>
              <tbody>
                <tr className="contenedorInfoTabla">
                  <td className="contenidoTabla">{`${selectedAsistente?.nombre} ${selectedAsistente?.apellido}`}</td>
                  <td className="contenidoTabla ">{selectedAsistente?.edad}</td>
                  <td className="contenidoTabla ">
                    {selectedAsistente?.telefono}
                  </td>
                  <td className="contenidoTabla ">
                    {selectedAsistente?.barrio}
                  </td>
                  <td className="contenidoTabla ">
                    {selectedAsistente?.dirección}
                  </td>
                  <td className="contenidoTabla ">{selectedAsistente?.nota}</td>
                  <td className="contenidoTabla ">
                    {selectedAsistente?.direccion}
                  </td>
                </tr>
              </tbody>
            </>
          )}
        </table>
        {user.rol === adminNuevos && (
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
                  <td className="contenidoTabla">
                    {item?.numberOfAsistencias}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Box>
    </Modal>
  );
};

export default ModalDetalleNuevos;
