import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Box, Modal } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const ModalDetalleNuevos = ({
  open,
  handleClose,
  selectedAsistente,
  asistentes,
}) => {
  const { style } = useContext(AuthContext);
  const highlightedDates = ["2024-02-15", "2024-02-20", "2024-02-25"];
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          ...style,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          width: "400px",
          maxWidth: "100%",
          height: "90%",
          maxHeight: "100%",
          padding: "10px",
          "&::-webkit-scrollbar": {
            width: "0.5em",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.1)",
          },
          "@media (min-width: 840px)": {
            flexDirection: "row",
            width: "90%",
            height: "auto",
            justifyContent: "center",
            padding: "20px",
          },
        }}
      >
        <FontAwesomeIcon
          icon={faXmark}
          onClick={handleClose}
          className="closeModal"
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            label="Último mes"
            value={dayjs().subtract(0, "month")}
            onChange={() => {}}
            disableFuture
            disablePast
            renderInput={(params) => <input {...params} readOnly />}
          />

          <StaticDatePicker
            label="Penúltimo mes"
            value={dayjs().subtract(1, "month")}
            onChange={() => {}}
            disableFuture
            disablePast
            renderInput={(params) => <input {...params} readOnly />}
          />
          <StaticDatePicker
            label="Antepenúltimo mes"
            value={dayjs().subtract(2, "month")}
            onChange={() => {}}
            disableFuturex
            disablePast
            renderInput={(params) => <input {...params} readOnly />}
          />
        </LocalizationProvider>
      </Box>
    </Modal>
  );
};

export default ModalDetalleNuevos;
