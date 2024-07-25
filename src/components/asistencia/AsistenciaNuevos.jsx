import { useContext, useEffect, useState } from "react";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Swal from "sweetalert2";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";

const AsistenciaNuevos = () => {
  const { user, adminNuevos, adminProspMiembros } = useContext(AuthContext);
  const [asistentesSeleccionados, setAsistentesSeleccionados] = useState([]);
  const [noAsistentes, setNoAsistentes] = useState([]);
  const [nombreAsistenteSeleccionado, setNombreAsistenteSeleccionado] =
    useState("");
  const [registradorSeleccionado, setRegistradorSeleccionado] = useState(null);
  const [asistentesFiltrados, setAsistentesFiltrados] = useState([]);
  const [isChange, setIsChange] = useState(false);
  const [asistentes, setAsistentes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fecha, setFecha] = useState("");
  const [motivoDeInasistencia, setMotivoDeInasistencia] = useState(false);
  const [inasistentesList, setInasistentesList] = useState([]);
  const options = [
    { value: "enfermedad", label: "Enfermedad" },
    { value: "enfermedad familiar", label: "Enfermedad Familiar" },
    { value: "trabajo", label: "Trabajo" },
    { value: "vacaciones", label: "Vacaciones" },
    { value: "falta de recursos", label: "Falta de Recursos" },
    { value: "apatia", label: "Apatia" },
    { value: "desconocido", label: "Desconocido" },
  ];

  useEffect(() => {
    setIsChange(false);
    const dataFetch = async () => {
      try {
        let asistenciaCollection =
          user.rol === adminNuevos
            ? collection(db, "asistentes")
            : user.rol === adminProspMiembros
            ? collection(db, "prospectosMiembros")
            : collection(db, "asistentes");
        const resAsistente = await getDocs(asistenciaCollection);
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

  // console.log(asistentes[0]?.inasistencias);

  useEffect(() => {
    if (registradorSeleccionado) {
      const filtroDeAsistentes = asistentes.filter(
        (asistente) => asistente.registrador === registradorSeleccionado
      );
      setAsistentesFiltrados(filtroDeAsistentes);
    } else {
      setAsistentesFiltrados(asistentes);
    }
  }, [asistentes, registradorSeleccionado, isChange]);

  const handleRegistradorChange = (event) => {
    setRegistradorSeleccionado(event.target.value);
  };

  const handleAsistencia = (asistente) => {
    noAsistentes;
    if (!fecha) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Debe seleccionar una fecha.",
      });
      return;
    }

    setAsistentesSeleccionados((prevAsistentesSeleccionados) => {
      if (prevAsistentesSeleccionados.includes(asistente.id)) {
        return prevAsistentesSeleccionados.filter((id) => id !== asistente.id);
      } else {
        setNoAsistentes((prevNoAsistentes) =>
          prevNoAsistentes.filter((id) => id !== asistente.id)
        );
        setInasistentesList((prevInasistentesList) =>
          prevInasistentesList.filter(
            (asistenteActual) => asistenteActual.id !== asistente.id
          )
        );
        return [...prevAsistentesSeleccionados, asistente.id];
      }
    });
  };

  const handleInasistencia = (asistente) => {
    asistentesSeleccionados;
    if (!fecha) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Debe seleccionar una fecha.",
      });
      return;
    }

    setNoAsistentes((prevNoAsistentes) => {
      if (prevNoAsistentes.includes(asistente.id)) {
        return prevNoAsistentes.filter((id) => id !== asistente.id);
      } else {
        setMotivoDeInasistencia(true);
        setAsistentesSeleccionados((prevAsistentesSeleccionados) =>
          prevAsistentesSeleccionados.filter((id) => id !== asistente.id)
        );
        return [...prevNoAsistentes, asistente.id];
      }
    });
  };

  // useEffect(() => {
  //   console.log("asistentes: ", asistentesSeleccionados);
  //   console.log("inasistentes: ", noAsistentes);
  //   console.log("motivos: ", inasistentesList);
  // }, [asistentesSeleccionados, noAsistentes, inasistentesList]);

  const handleFinalizar = async () => {
    if (!fecha) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Debe seleccionar una fecha.",
      });
      return;
    }
    if (inasistentesList.length != noAsistentes.length) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Debe seleccionar el motivo de inasistencia.",
      });
      return;
    }

    try {
      setLoading(true);
      const batch = writeBatch(db);
      asistentesSeleccionados?.forEach((asistenteId) => {
        const asistente = asistentes?.find((a) => a.id === asistenteId);
        const inasistenciaRegistrada = asistente?.inasistencias?.some(
          (inasistencia) => {
            inasistencia.fecha === fecha;
          }
        );
        const asistenciaRegistrada =
          Array.isArray(asistente?.diasAsistidos) &&
          asistente.diasAsistidos.includes(fecha);
        if (user.rol === adminNuevos ? asistente && !asistenciaRegistrada : asistente && !asistenciaRegistrada && !inasistenciaRegistrada) {
          const updatedDiasAsistidos = Array.isArray(asistente?.diasAsistidos)
            ? [...asistente.diasAsistidos, fecha]
            : [fecha];
          const asistenteRef =
            user.rol === adminNuevos
              ? doc(db, "asistentes", asistente.id)
              : doc(db, "prospectosMiembros", asistente.id);
          batch.update(asistenteRef, { diasAsistidos: updatedDiasAsistidos });
        }
        
      });
      if (user.rol === adminProspMiembros) {
        inasistentesList?.forEach(({ id, motivo }) => {
          const asistente2 = asistentes?.find((a) => a.id === id);
          const asistenciaRegistrada2 =
            Array.isArray(asistente2?.diasAsistidos) &&
            asistente2.diasAsistidos.includes(fecha);
          const inasistenciaRegistrada = asistente2?.inasistencias?.some(
            (inasistencia) => {
              inasistencia.fecha === fecha;
            }
          );
          if (
            asistente2 &&
            !inasistenciaRegistrada &&
            !asistenciaRegistrada2
          ) {
            const updatedInasistencias = Array.isArray(
              asistente2.inasistencias
            )
              ? [
                  ...asistente2.inasistencias,
                  { fecha: fecha, motivo: motivo },
                ]
              : [{ fecha: fecha, motivo: motivo }];
            const asistenteRef = doc(db, "prospectosMiembros", id);
            batch.update(asistenteRef, {
              inasistencias: updatedInasistencias,
            });
          }
        });
      }
      await batch.commit();
      Swal.fire({
        icon: "success",
        title: "Asistencia registrada exitosamente",
        text: "La asistencia ha sido registrada con éxito.",
      });
      setIsChange(!isChange);
      setAsistentesSeleccionados([]);
      setInasistentesList([]);
      setMotivoDeInasistencia([]);
      setNoAsistentes([]);
    } catch (error) {
      console.error("Error updating document: ", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un problema al intentar registrar la asistencia. Por favor, inténtalo de nuevo más tarde.",
      });
    }
    setLoading(false);
  };

  const handleCloseNombreAsistSeleccionado = () => {
    setNombreAsistenteSeleccionado("");
  };

  const handleMotivoInasistencia = (asistente, motivo) => {
    setInasistentesList((prevInasistentesList) => {
      const updatedList = prevInasistentesList.map((item) =>
        item.id === asistente.id ? { ...item, motivo: motivo } : item
      );
      if (!updatedList.find((item) => item.id === asistente.id)) {
        updatedList.push({ id: asistente.id, motivo: motivo });
      }

      return updatedList;
    });
  };

  return (
    <div className="containerTable">
      <div className="containerFiltros">
        <div className="sectionFiltros">
          {user.rol === adminNuevos && (
            <div className="contentIndividualFiltro">
              Buscar por registrador
              <select
                value={registradorSeleccionado || ""}
                onChange={handleRegistradorChange}
                className="registradorAsistencia"
              >
                <option value="">Seleccionar Registrador</option>
                {asistentes
                  ?.map((asistente) => asistente.registrador)
                  .filter((value, index, self) => self.indexOf(value) === index) // Filtra duplicados
                  .map((registrador) => (
                    <option key={registrador} value={registrador}>
                      {registrador}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="containerFiltroXNombre">
            Buscar por nombre del asistente
            <Select
              id="asistente"
              className="filtrarNombre"
              value={asistentes?.find(
                (asistente) => asistente?.id === nombreAsistenteSeleccionado
              )}
              onChange={(selectedOption) => {
                setNombreAsistenteSeleccionado(selectedOption),
                  setIsChange(!isChange);
              }}
              options={asistentes.map((asistente) => ({
                value: asistente.id,
                label: `${asistente.nombre} ${asistente.apellido}`,
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
          <div className="contentIndividualFiltro">
            Seleccionar fecha de asistencia
            <input
              id="fecha"
              type="date"
              className="fechaAsistencia"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr className="contenedorTituloTabla">
            <th className="encabezadoTabla nombre">NOMBRE</th>
            <th className="encabezadoTabla">ASISTENCIA</th>
            {user.rol === adminProspMiembros && (
              <th className="encabezadoTabla">MOTIVO DE INASISTENCIA</th>
            )}
            {user.rol === adminNuevos && (
              <th className="encabezadoTabla">REGISTRADO POR</th>
            )}
          </tr>
        </thead>
        <tbody>
          {nombreAsistenteSeleccionado
            ? asistentes
                .filter(
                  (asistente) =>
                    asistente.id === nombreAsistenteSeleccionado.value
                )
                .map(
                  (asistente) =>
                    asistente.id === nombreAsistenteSeleccionado.value && (
                      <tr className="contenedorAsistente" key={asistente.id}>
                        <td className="contenidoTabla">{`${asistente.nombre} ${asistente.apellido}`}</td>
                        <td className="containerCheckbox">
                          <span
                            className={`asistencia ${
                              asistentesSeleccionados?.includes(asistente.id)
                                ? "clicadoAsistencia"
                                : ""
                            }`}
                            onClick={() => handleAsistencia(asistente)}
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </span>
                          {user.rol === adminProspMiembros && (
                            <span
                              className={`inasistencia ${
                                noAsistentes?.includes(asistente.id)
                                  ? "clicadoInasistencia"
                                  : ""
                              }`}
                              onClick={() => handleInasistencia(asistente)}
                            >
                              <FontAwesomeIcon icon={faXmark} />
                            </span>
                          )}
                        </td>
                        {user.rol === adminNuevos && (
                          <td className="contenidoTabla registrador">
                            {asistente.registrador}
                          </td>
                        )}
                        {user.rol === adminProspMiembros &&
                          motivoDeInasistencia &&
                          noAsistentes?.includes(asistente.id) && (
                            <Select
                              id="justificacion"
                              className="justificacion"
                              value={options.find(
                                (option) => option.value === asistente.motivo
                              )}
                              onChange={(selectedOption) => {
                                handleMotivoInasistencia(
                                  asistente,
                                  selectedOption.value
                                );
                              }}
                              options={options}
                            />
                          )}
                      </tr>
                    )
                )
            : asistentesFiltrados.map((asistente) => (
                <tr className="contenedorAsistente" key={asistente.id}>
                  <td className="contenidoTabla">{`${asistente.nombre} ${asistente.apellido}`}</td>
                  <td className="containerCheckbox">
                    <span
                      className={`asistencia ${
                        asistentesSeleccionados?.includes(asistente.id)
                          ? "clicadoAsistencia"
                          : ""
                      }`}
                      onClick={() => handleAsistencia(asistente)}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </span>
                    {user.rol === adminProspMiembros && (
                      <span
                        className={`inasistencia ${
                          noAsistentes?.includes(asistente.id)
                            ? "clicadoInasistencia"
                            : ""
                        }`}
                        onClick={() => handleInasistencia(asistente)}
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </span>
                    )}
                  </td>
                  {user.rol === adminNuevos && (
                    <td className="contenidoTabla registrador">
                      {asistente.registrador}
                    </td>
                  )}
                  {user.rol === adminProspMiembros &&
                    motivoDeInasistencia &&
                    noAsistentes?.includes(asistente.id) && (
                      <td>
                        <Select
                          id={asistente.id}
                          className="justificacion"
                          value={options.find(
                            (option) => option.value === asistente.motivo
                          )}
                          onChange={(selectedOption) => {
                            handleMotivoInasistencia(
                              asistente,
                              selectedOption.value
                            );
                          }}
                          options={options}
                        />
                      </td>
                    )}
                </tr>
              ))}
        </tbody>
      </table>
      <button onClick={handleFinalizar} className="buttonAsistenciaNuevos">
        {loading ? "CARGANDO..." : "FINALIZAR"}
      </button>
    </div>
  );
};

export default AsistenciaNuevos;
