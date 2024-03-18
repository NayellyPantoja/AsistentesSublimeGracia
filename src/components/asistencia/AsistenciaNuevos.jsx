import { useEffect, useState } from "react";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Swal from "sweetalert2";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const AsistenciaNuevos = () => {
  const [asistentesSeleccionados, setAsistentesSeleccionados] = useState([]);
  const [nombreAsistenteSeleccionado, setNombreAsistenteSeleccionado] =
    useState("");
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
  }, [asistentes, registradorSeleccionado, isChange]);

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

  const handleCloseNombreAsistSeleccionado = () => {
    setNombreAsistenteSeleccionado("")
  }

  return (
    <div className="containerTable">
      <div className="containerFiltros">
        <div className="sectionFiltros">
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
        {nombreAsistenteSeleccionado && <FontAwesomeIcon
          icon={faXmark}
          onClick={handleCloseNombreAsistSeleccionado}
          className="closeFiltroNombre"
        />}
        
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
            <th className="encabezadoTabla">REGISTRADO POR</th>
          </tr>
        </thead>
        <tbody>
          {nombreAsistenteSeleccionado
            ? asistentes
                .filter(
                  (asistente) => asistente.id === nombreAsistenteSeleccionado.value
                )
                .map(
                  (asistente) =>
                    asistente.id === nombreAsistenteSeleccionado.value && (
                      <tr className="contenedorAsistente" key={asistente.id}>
                        <td className="contenidoTabla">{`${asistente.nombre} ${asistente.apellido}`}</td>
                        <td
                          onClick={() => handleSelectAsistente(asistente)}
                          className="contenidoTabla checkboxCell"
                        >
                          <input
                            type="checkbox"
                            checked={asistentesSeleccionados.includes(
                              asistente.id
                            )}
                            disabled={!fecha}
                          />
                        </td>
                        <td className="contenidoTabla registrador">
                          {asistente.registrador}
                        </td>
                      </tr>
                    )
                )
            : asistentesFiltrados.map((asistente) => (
                <tr className="contenedorAsistente" key={asistente.id}>
                  <td className="contenidoTabla">{`${asistente.nombre} ${asistente.apellido}`}</td>
                  <td
                    onClick={() => handleSelectAsistente(asistente)}
                    className="contenidoTabla checkboxCell"
                  >
                    <input
                      type="checkbox"
                      checked={asistentesSeleccionados.includes(asistente.id)}
                      disabled={!fecha}
                    />
                  </td>
                  <td className="contenidoTabla registrador">
                    {asistente.registrador}
                  </td>
                </tr>
              ))}
        </tbody>
        
      </table>
      <button onClick={handleFinalizar} className="buttonAsistenciaNuevos">
        FINALIZAR
      </button>
    </div>
  );
};

export default AsistenciaNuevos;
