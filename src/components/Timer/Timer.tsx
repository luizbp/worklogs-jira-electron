/* eslint-disable jsx-a11y/anchor-is-valid */

import "./index.css";

import {
  BsFillStopCircleFill,
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsFillXCircleFill,
  BsFillPlusCircleFill,
} from "react-icons/bs";

import { HiDocumentMagnifyingGlass } from "react-icons/hi2";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ModalWorkLogs } from "../ModalWorkLogs/ModalWorkLogs";
import { ModalManualLog } from "../ModalManualLog/ModalManualLog";
import { workLogsController } from "../../services/SaveDataLocal/workLogsController";
import { getFormattedDate } from "../../helpers/getFormattedDate";
import { useConfig } from "../../contexts/ConfigContext";
import { useJira } from "../../contexts/JiraContext";

export const Timer = () => {
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [startDate, setStartDate] = useState<Date>();
  const [StartHour, setStartHour] = useState("");

  const [openModalLogs, setOpenModalLogs] = useState(false);
  const [openModalManualLogs, setOpenModalManualLogs] = useState(false);
  const { timerMode, setTimerMode, task, description, getWorkLog, isTimerActive, setIsTimerActive} =
  useConfig();
  const { createWorkLog } = useJira();
  
  useEffect(() => {
    let interval: any = null;

    if (isTimerActive && isPaused === false) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isTimerActive, isPaused]);

  const clearWorkLog = () => {
    Swal.fire({
      title: "Attention",
      text: `Clear all saved worklogs`,
      showCancelButton: true,
      confirmButtonColor: "#08979c",
      cancelButtonColor: "#ff4d4f",
      confirmButtonText: "Clean",
    }).then((result) => {
      if (result.isConfirmed) {
        workLogsController().clearAll();
        getWorkLog();

        Swal.fire({
          icon: "success",
        });
      }
    });
  };

  const deleteWorkLog = (id: string) => {
    Swal.fire({
      title: "Delete Worklog",
      showCancelButton: true,
      confirmButtonColor: "#08979c",
      cancelButtonColor: "#ff4d4f",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        workLogsController().remove(id);
        getWorkLog();
      }
    });
  };

  const validateFields = (): boolean => {
    if (!task) {
      setTimerMode("window");

      Swal.fire({
        title: "Ops...",
        text: "Task not informed",
      });

      return false;
    }

    if (!description) {
      setTimerMode("window");

      Swal.fire({
        title: "Ops...",
        text: "Description not informed",
      });

      return false;
    }

    return true;
  };

  const handleStarPauseResume = (pIsPaused?: boolean) => {
    if (!validateFields()) return;

    if (time === 0) {
      
      setIsTimerActive(true);
      setIsPaused(false);

      setStartDate(new Date());
      setStartHour(getFormattedDate(new Date()).hour);

      return;
    }
    setIsPaused(pIsPaused || !isPaused);
  };

  const handleReset = () => {
    setIsTimerActive(false);
    setTime(0);
  };

  const handleStop = async () => {
    if (!time) return;

    if (!validateFields()) return;

    const hour = Math.floor((time / 3600000) % 60);
    let min = Math.floor((time / 60000) % 60);

    if (Math.floor((time / 1000) % 60) >= 30) {
      min += 1;
    }

    handleStarPauseResume(true);

    setTimerMode("window");

    if (!hour && !min) {
      const result = await Swal.fire({
        title: "Attention",
        text: `Insufficient amount of time Want to reset the timer?`,
        showCancelButton: true,
        confirmButtonColor: "#08979c",
        cancelButtonColor: "#ff4d4f",
        confirmButtonText: "Reset",
      });

      if (result.isConfirmed) {
        handleReset();
      }

      return;
    }

    const completTime = `${hour}h ${min}m`;

    const regex = new RegExp(/^([A-Z]+-\d+)/);
    const regexResult = regex.exec(task?.value ?? '')


    if(!regexResult?.length) {
      Swal.fire({
        title: "Invalid Task ID",
        icon: "error"
      })
  
      return
    }
    
    const taskFormatted = regexResult[0]

    Swal.fire({
      title: "Save Worklog",
      html: `Time: <b>"${completTime}"</b><br> 
             Task: <b>"${taskFormatted}"</b><br> 
             Description: <b>"${description?.value}"</b>`,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      confirmButtonColor: "#08979c",
      cancelButtonColor: "#ff4d4f",
      confirmButtonText: "Save",
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        const result = await createWorkLog({
          workLog: {
            id: Date.now().toString(),
            startDate: startDate?.toISOString() || "",
            startDateFormatted: StartHour,
            description: description?.value || "",
            task: taskFormatted,
            time: completTime
          },
          callbackIntegrationError: () => {
            getWorkLog();
            handleReset();
          }
        });
        
        return result.integratedWorkLog
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
        });
        getWorkLog();
        handleReset();
      }
    })
  };

  return (
    <div className="timer">
      <div className="box-numbers">
        <div className="number">
          {" "}
          {("0" + Math.floor((time / 3600000) % 60)).slice(-2)}:{" "}
          <span className="description">h</span>
        </div>
        <div className="number">
          {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:{" "}
          <span className="description">min</span>
        </div>
        <div className="number">
          {("0" + Math.floor((time / 1000) % 60)).slice(-2)}
          <span className="description">seg</span>
        </div>
      </div>
      <div className="box--timer-controls">
        <a
          className="button--circle-primary"
          id="button-stop"
          href="#"
          title={isTimerActive && !isPaused ? "Stop" : "Start"}
          onClick={() => {
            handleStarPauseResume();
          }}
        >
          {isTimerActive && !isPaused ? (
            <BsFillPauseCircleFill className="color-secundary" />
          ) : (
            <BsFillPlayCircleFill className="color-primary" />
          )}
        </a>
        <a
          className="button--circle-secundary"
          id="button-reset"
          href="#"
          title="Reset"
          onClick={() => {
            handleReset();
          }}
        >
          <BsFillXCircleFill />
        </a>
        <a
          className={`button--circle-secundary ${
            !time ? "color-disabled" : ""
          }`}
          id="button-pause"
          href="#"
          title={"Finish"}
          onClick={async () => {
            await handleStop();
          }}
        >
          <BsFillStopCircleFill />
        </a>
        <a
          className={`button--circle-secundary ${time ? "color-disabled" : ""}`}
          id="button-add-manual"
          href="#"
          title={"Add Manual"}
          onClick={() => {
            setTimerMode("window");
            setOpenModalManualLogs(true);
          }}
        >
          <BsFillPlusCircleFill />
        </a>
      </div>
      {timerMode === "window" && (
        <div className="box--buttons">
          {
            <a
              className="button--primary"
              id="button-stop"
              href="#"
              onClick={() => {
                setOpenModalLogs(true);
              }}
            >
              View WorkLogs{" "}
              <HiDocumentMagnifyingGlass className="color-primary" />
            </a>
          }
        </div>
      )}
      <ModalWorkLogs
        handleClose={() => setOpenModalLogs(false)}
        open={openModalLogs}
        clearLogs={clearWorkLog}
        deleteWorkLog={deleteWorkLog}
      />
      <ModalManualLog
        handleClose={() => setOpenModalManualLogs(false)}
        open={openModalManualLogs}
      />
    </div>
  );
};
