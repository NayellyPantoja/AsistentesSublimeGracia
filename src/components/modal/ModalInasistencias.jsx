
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Box, Modal } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const ModalInasistencias = ({
  openInasistencias,
  selectedAsistente,
  handleCloseInasistencias,
  fechasInasistidas,
  setFechasInasistidas
}) => {
  const { style } = useContext(AuthContext);
  console.log( "fechas", fechasInasistidas)
  useEffect(() => {
    console.log(fechasInasistidas);
  }, [fechasInasistidas]);

  const deleteFecha = async (fechaAEliminar, documentId) => {
    try {
      const shouldDelete = await Swal.fire({
        title: "¿Estás seguro?",
        text: `¡Eliminarás la inasistencia del ${fechaAEliminar}!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#7CAC41",
        cancelButtonColor: "#04441C",
        confirmButtonText: "Sí, eliminarlo",
        cancelButtonText: "Cancelar",
        customClass: {
          container: 'my-swal'
        },
      });

      if (shouldDelete.isConfirmed) {
        const docRef = doc(db, "prospectosMiembros", documentId);

        
        const nuevoDiasSinAsistir = selectedAsistente.inasistencias.filter(
          (inasistencia) => inasistencia.fecha !== fechaAEliminar
        );

        await updateDoc(docRef, {
          inasistencias: nuevoDiasSinAsistir,
        });
        console.log(nuevoDiasSinAsistir);

        const inasistenciasActualizadas = nuevoDiasSinAsistir.map((inasistencia) => inasistencia.fecha)

        setFechasInasistidas(inasistenciasActualizadas);

        Swal.fire({
          title: "Eliminado",
          text: `La fecha ${fechaAEliminar} ha sido eliminada`,
          icon: "success",
          confirmButtonColor: "#7CAC41",
          customClass: {
            container: 'my-swal'
          },
        });
      }
    } catch (error) {
      console.error("Error al eliminar la fecha:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un error al intentar eliminar la fecha seleccionada",
        icon: "error",
        customClass: {
          container: 'my-swal'
        },
      });
    }
  };

  return (
    <Modal
      open={openInasistencias}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...style, display: "flex", flexDirection: "column" }}>
        <FontAwesomeIcon
          icon={faXmark}
          onClick={handleCloseInasistencias}
          className="closeModal"
        />
        <div className="asistenciaListContainer">
          <div className="title">INASISTENCIAS</div>
          {fechasInasistidas.length >= 1 ? (
            fechasInasistidas.map((inasistencia, index) => (
              <div key={index} className="fecha">
                {inasistencia} 
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className="botonDelete pastor"
                  onClick={() => deleteFecha(inasistencia, selectedAsistente.id)}
                />
              </div>
            ))
          ) : (
            <div className="sinRegistro">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="warning"
              />
              No hay registros de inasistencias
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default ModalInasistencias;
