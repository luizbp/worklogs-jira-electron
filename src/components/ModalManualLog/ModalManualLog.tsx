import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CreatableSelect from "react-select/creatable";

import "./index.css";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { workLogsController } from "../../services/SaveDataLocal/workLogsController";
import { getFormattedDate } from "../../helpers/getFormattedDate";
import { useConfig } from "../../contexts/ConfigContext";
import { WorkLog } from "../../types/WorkLogs";
import { useJira } from "../../contexts/JiraContext";

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

type ModalWorkLogsParams = {
  open: boolean;
  handleClose: any;
};

export const ModalManualLog = ({ handleClose, open }: ModalWorkLogsParams) => {
  const [startDate, setStartDate] = useState("");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const {
    task,
    setTask,
    description,
    setDescription,
    optionsTask,
    optionsDescription,
    addData,
    getWorkLog,
  } = useConfig();
  const { createWorkLog, cloudIdSelected } = useJira();

  const clearFields = () => {
    setStartDate("");
    setHours("0");
    setMinutes("0");
  };

  const save = () => {
    const fullDate = getFormattedDate(new Date(startDate));
    const dateFormated = `${fullDate.date} - ${fullDate.hour}`;

    if (!description || !task) return;

    Swal.fire({
      title: "Save Worklog",
      html: `Time: <b>"${hours}h ${minutes}m"</b><br> 
             Task: <b>"${task.value}"</b><br> 
             Description: <b>"${description.value}"</b><br>
             Start Date: <b>"${dateFormated}"</b><br> 
             `,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#08979c",
      confirmButtonText: "Save",
      preConfirm: async (login) => {
        let result = true
        const workLog = workLogsController();

        const newItem = {
          id: Date.now().toString(),
          startDate: new Date(startDate).toISOString(),
          startDateFormatted: fullDate.hour,
          description: description.value,
          task: task.value,
          time: `${hours}h ${minutes}m`,
        } as WorkLog;

        try {
          if (cloudIdSelected.current) {
            await createWorkLog({
              description: newItem.description,
              started: newItem.startDate.replaceAll("Z", "+0000"),
              task: newItem.task,
              time: newItem.time,
              cloudId: cloudIdSelected.current,
            });

            newItem.integration = {
              registered: true,
              msg: "Successfully registered",
            };
          }
        } catch (err: any) {
          let msg = err?.response?.data?.message
          msg = msg ?? err?.response?.data?.errorMessages?.join(" - ")
          msg = msg ?? 'Error'

          Swal.fire({
            title: "Error in integration with Jira",
            text: msg,
            icon: "error",
          }).then(() => {
            getWorkLog();
            clearFields();
            handleClose();
          })
          
          newItem.integration = {
            registered: false,
            msg,
          };
          
          result = false 
        }

        workLog.save({
          newItem,
        });

        return result
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Saved successfully!",
          icon: "success",
        });

        getWorkLog();
        clearFields();
        handleClose();
      }
    })
  };

  useEffect(() => {
    const data = new Date();
    let currentData = new Date(
      data.valueOf() - data.getTimezoneOffset() * 60000
    );
    setStartDate(`${currentData.toISOString().replace(/:\d+\.\d+Z$/, "")}`);
  }, [open]);

  return (
    <Modal
      sx={styleModal}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal-manual-log"
    >
      <Box sx={styleBoxModal}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          textAlign={"center"}
        >
          Manual WorkLog
        </Typography>
        <div className="box--fields">
          <div>
            <label htmlFor="startDate">Start Date</label>
            <TextField
              value={startDate}
              onChange={({ target: { value } }) => setStartDate(value)}
              fullWidth
              id="startDate"
              type={"datetime-local"}
            />
          </div>
          <div>
            <label htmlFor="task">Task</label>
            <CreatableSelect
              isClearable
              id="select-task"
              onChange={(task) => setTask(task)}
              onCreateOption={(task) => {
                const regexValidate = new RegExp(/^([A-Za-z]+)-(\d+)$/);

                if (!regexValidate.test(task)) {
                  Swal.fire({
                    title:
                      'Incorrect format, it must be in the format "XXX...-000..." e.g. "ODR-3520"',
                    icon: "error",
                  });

                  return;
                }

                addData("task", {
                  value: task.toUpperCase(),
                  label: task.toUpperCase(),
                });
              }}
              options={optionsTask}
              value={
                task
                  ? {
                      value: task.value.toUpperCase(),
                      label: task.label.toUpperCase(),
                    }
                  : null
              }
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <CreatableSelect
              isClearable
              id="select-description"
              onChange={(description) => {
                setDescription(description);
              }}
              onCreateOption={(description) =>
                addData("description", {
                  value: description,
                  label: description,
                })
              }
              options={optionsDescription}
              value={description}
            />
          </div>
          <div>
            <label htmlFor="time">Time</label>
            <div className="box--time">
              <TextField
                value={hours}
                onChange={({ target: { value } }: any) => setHours(value)}
                id="hours"
                type="number"
              />
              <p>h</p>
              <TextField
                value={minutes}
                onChange={({ target: { value } }: any) => setMinutes(value)}
                id="minutes"
                type="number"
              />
              <p>m</p>
            </div>
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
