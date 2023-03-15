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
import type { Option } from "../../types/Option";
import Swal from "sweetalert2";
import { WorkLog, WorkLogs } from "../../types/WorkLogs";
import { ModalWorkLogs } from "../ModalWorkLogs/ModalWorkLogs";
import { ModalManualLog } from "../ModalManualLog/ModalManualLog";

type TimerParams = {
  task: Option | null | undefined;
  description: Option | null | undefined;
};

export const Timer = ({ description, task }: TimerParams) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [logs, setLogs] = useState<WorkLogs>([]);
  const [time, setTime] = useState(0);
  const [startDate, setStartDate] = useState('')

  const [openModalLogs, setOpenModalLogs] = useState(false);
  const [openModalManualLogs, setOpenModalManualLogs] = useState(false);

  useEffect(() => {
    let interval: any = null;

    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  useEffect(() => {
    getWorkLog()
  }, [])

  const getWorkLog = async () => {
    const defaultLogs = localStorage.getItem("logs");

    setLogs(defaultLogs ? JSON.parse(defaultLogs) : []);
  };

  const saveWorkLog = (newItem: WorkLog) => {
    const type = "logs";
    const currentData = localStorage.getItem(type);
    const logs: WorkLogs = currentData ? JSON.parse(currentData) : [];

    logs.push(newItem);
    localStorage.setItem(type, JSON.stringify(logs));

    setLogs(logs);
  };

  const clearWorkLog = () => {
    Swal.fire({
      title: "Attention",
      text: `Clear all saved worklogs`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Clean"
    }).then((result) => {
      if (result.isConfirmed) {
        const type = "logs";
        localStorage.setItem(type, JSON.stringify([]));
        setLogs([]);

        getWorkLog()

        Swal.fire({
          icon: "success",
        });
      }
    });
  };

  const validateFields = (): boolean => {
    if (!task) {
      Swal.fire({
        title: "Ops...",
        text: "Task not informed",
      });

      return false;
    }

    if (!description) {
      Swal.fire({
        title: "Ops...",
        text: "Description not informed",
      });

      return false;
    }

    return true;
  };

  const handleStarPauseResume = () => {
    if (!validateFields()) return;

    if (time === 0) {
      setIsActive(true);
      setIsPaused(false);

      setStartDate(new Date().toLocaleDateString())

      return;
    }
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  const handleStop = () => {
    if (!time) return;

    if (!validateFields()) return;

    const completTime = `${Math.floor((time / 3600000) % 60)}h ${Math.floor(
      (time / 60000) % 60
    )}m`;
    handleStarPauseResume();

    Swal.fire({
      title: "Save Worklog",
      html: `Time: <b>"${completTime}"</b><br> 
             Task: <b>"${task?.value}"</b><br> 
             Description: <b>"${description?.value}"</b>`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        saveWorkLog({
          startDate: startDate,
          description: description?.value || "",
          task: task?.value || "",
          time: completTime,
        });

        Swal.fire({
          title: "Saved successfully!",
          icon: "success",
        });
        handleReset();
      }
    });
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
          <div className="number miliseconds">
            ,{("0" + ((time / 10) % 100)).slice(-2)}
            <span className="description"></span>
          </div>
        </div>
        <div className="box--timer-controls">
          <a
            className="button--circle-primary"
            id="button-stop"
            href="#"
            title={isActive && !isPaused ? "Pausar" : "Iniciar"}
            onClick={() => {
              handleStarPauseResume();
            }}
          >
            {isActive && !isPaused ? (
              <BsFillPauseCircleFill className="color-secundary" />
            ) : (
              <BsFillPlayCircleFill className="color-primary" />
            )}
          </a>
          <a
            className="button--circle-secundary"
            id="button-reset"
            href="#"
            title="Resetar"
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
            title={"Finalizar"}
            onClick={() => {
              handleStop();
            }}
          >
            <BsFillStopCircleFill />
          </a>
          <a
            className={`button--circle-secundary ${
              time ? "color-disabled" : ""
            }`}
            id="button-pause"
            href="#"
            title={"Finalizar"}
            onClick={() => {
              setOpenModalManualLogs(true)
            }}
          >
            <BsFillPlusCircleFill />
          </a>
        </div>
        <div className="box--buttons">
          <a
            className="button--primary"
            id="button-stop"
            href="#"
            onClick={() => {
              setOpenModalLogs(true);
            }}
          >
            View WorkLogs <HiDocumentMagnifyingGlass className="color-primary" />
          </a>
        </div>
        <ModalWorkLogs handleClose={() => setOpenModalLogs(false)} open={openModalLogs} logs={logs} clearLogs={clearWorkLog}/>
        <ModalManualLog handleClose={() => setOpenModalManualLogs(false)} open={openModalManualLogs} saveWorkLog={saveWorkLog}/>
      </div>
  );
};
