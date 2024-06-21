import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import "./index.css";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Swal from "sweetalert2";
import { useConfig } from "../../contexts/ConfigContext";

const styleBoxModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  "max-width": "500px",
  pt: 2,
  px: 4,
  pb: 3,
};

const styleModal = {
  margin: "50px",
  "z-index": "9",
};

type ModalAddTaskParams = {
  open: boolean;
  handleClose: any;
};

export const ModalAddTask = ({ handleClose, open }: ModalAddTaskParams) => {
  const [taskId, setTaskId] = useState("");
  const [identificator, setIdentificator] = useState("");
  const { setTask, addData, optionsTask } = useConfig()

  const clearFields = () => {
    setIdentificator("");
    setTaskId("");
  };

  const save = () => {
    if(optionsTask.find((task) => task.value === taskId)) {
      Swal.fire({
        title:
          'This task has already been registered',
        icon: "info",
      });

      return;
    }

    if(!taskId) {
      Swal.fire({
        title:
          'No task id provided',
        icon: "error",
      });

      return;
    }

    const regexValidate = new RegExp(/^([A-Za-z]+)-(\d+)$/);

    if (!regexValidate.test(taskId)) {
      Swal.fire({
        title:
          'Incorrect format, it must be in the format "XXX...-000..." e.g. "ODR-3520"',
        icon: "error",
      });

      return;
    }

    const newTask = {
      value: taskId.toUpperCase(),
      label: identificator ? `${taskId.toUpperCase()} - ${identificator.toUpperCase()}` : `${taskId.toUpperCase()}`,
    }

    addData("task", newTask);
    setTask(newTask);
    clearFields();
    handleClose();
  };

  return (
    <Modal
      sx={styleModal}
      open={open}
      onClose={handleClose}
      className="modal-add-task"
    >
      <Box sx={styleBoxModal}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          textAlign={"center"}
        >
          Add new task
        </Typography>
        <div className="box--fields">
          <div>
            <label htmlFor="taskId">Task ID *</label>
            <TextField
              value={taskId}
              onChange={({ target: { value } }) => setTaskId(value.toUpperCase())}
              fullWidth
              id="taskId"
              type={"text"}
            />
          </div>
          <div>
            <label htmlFor="identificator">Identificator</label>
            <TextField
              value={identificator}
              onChange={({ target: { value } }) => setIdentificator(value)}
              fullWidth
              id="identificator"
              type={"text"}
            />
          </div>
        </div>
        <Box className="box--modal-buttons">
          <Button
            variant="contained"
            onClick={save}
            color="primary"
            className="button--clear-worklogs"
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              clearFields();
              handleClose();
            }}
            className="button--cancel-worklogs"
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
