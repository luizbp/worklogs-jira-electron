import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TableLogs } from "../TableLogs/TableLogs";
import { WorkLogs } from "../../types/WorkLogs";
import Button from "@mui/material/Button";

import "./index.css";

const styleBoxModal = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  "max-width": "600px",
  pt: 2,
  px: 4,
  pb: 3,
};

const styleModal = {
  margin: "50px",
  "z-index": "9",
  "heigth": "200px"
};

type ModalWorkLogsParams = {
  open: boolean;
  handleClose: any;
  clearLogs: any;
  deleteWorkLog: (id: string) => void;
  logs: WorkLogs;
};

export const ModalWorkLogs = ({
  handleClose,
  open,
  logs,
  clearLogs,
  deleteWorkLog
}: ModalWorkLogsParams) => {
  return (
    <Modal
      sx={styleModal}
      open={open}
      disableScrollLock={true}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styleBoxModal}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          textAlign={"center"}
        >
          WorkLogs
        </Typography>
        <TableLogs logs={logs} deleteWorkLog={deleteWorkLog}/>
        <div className="box--modal-buttons">
          <Button
            variant="contained"
            onClick={clearLogs}
            className="button--clear-worklogs"
          >
            Clean
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleClose();
            }}
            className="button--cancel-worklogs"
          >
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};
