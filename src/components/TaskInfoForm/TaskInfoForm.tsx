/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import Swal from "sweetalert2";

import "./index.css";

import { useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { BsFillXCircleFill } from "react-icons/bs";
import { formDataController } from "../../services/SaveDataLocal/formDataController";
import type { FormData } from "../../types/FormData";
import { useConfig } from "../../contexts/ConfigContext";

export const TaskInfoForm = () => {
  const {
    timerMode,
    task,
    setTask,
    description,
    setDescription,
    optionsTask,
    optionsDescription,
    getData,
    addData,
  } = useConfig();

  const clearData = (type: FormData) => {
    Swal.fire({
      title: "Attention",
      text: `Delete ${type} option?`,
      showCancelButton: true,
      confirmButtonColor: "#08979c",
      cancelButtonColor: "#ff4d4f",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        formDataController(type).remove(
          type === "task" ? task?.value : description?.value
        );

        if (type === "task") {
          setTask(null);
        } else {
          setDescription(null);
        }

        getData();
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  if (timerMode === "minimalist") return null;

  return (
    <div className="task-info-form">
      <div className="select-task">
        <label>Task Number</label>
        <div className="box--select">
          <CreatableSelect
            isClearable
            id="select-task"
            onChange={(task) => {
              setTask(task);
            }}
            onCreateOption={(task) =>
              addData("task", {
                value: task.toUpperCase(),
                label: task.toUpperCase(),
              })
            }
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
          <BsFillXCircleFill
            className="button--clear"
            title="Delete task option"
            onClick={() => clearData("task")}
          />
        </div>
      </div>
      <div className="select-description">
        <label>Description</label>
        <div className="box--select">
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
          <BsFillXCircleFill
            className="button--clear"
            title="Delete description option"
            onClick={() => clearData("description")}
          />
        </div>
      </div>
    </div>
  );
};
