import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TableLogs } from "../TableLogs/TableLogs";
import { WorkLogs } from "../../types/WorkLogs";
import Button from "@mui/material/Button";
import { BsTrash } from 'react-icons/bs'

import "./index.css"

const styleBoxModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  'width': '100%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  'max-width': '500px',
  pt: 2,
  px: 4,
  pb: 3,
};

const styleModal = {
  margin: "50px",
  "z-index": "9"
};

type ModalWorkLogsParams = {
  open: boolean
  handleClose: any
  clearLogs: any
  logs: WorkLogs
}

export const ModalWorkLogs = ({handleClose, open, logs, clearLogs}: ModalWorkLogsParams) => {
  return (
    <Modal
        sx={styleModal}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleBoxModal}>
          <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={'center'}>
            WorkLogs
          </Typography>
          <TableLogs logs={logs}/>
          <div className="box--modal-buttons">
            <Button variant="contained" className="button--clear-worklogs" startIcon={<BsTrash className="icon-clean"/>} onClick={clearLogs}>
              Clear WorkLogs
            </Button>
          </div>
        </Box>
      </Modal>
  )
}