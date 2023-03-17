/* eslint-disable jsx-a11y/anchor-is-valid */
import Swal from "sweetalert2";

import "./index.css";

import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import type { Option } from "../../types/Option";
import { BsFillXCircleFill } from "react-icons/bs";
import { formDataController } from "../../services/SaveDataLocal/formDataController";
import type { FormData } from "../../types/FormData";

type TaskInfoFormParams = {
  task: Option | null | undefined;
  description: Option | null | undefined;
  setTask: (task: Option | null) => any;
  setDescription: (description: Option | null) => any;
};

export const TaskInfoForm = ({
  task,
  description,
  setDescription,
  setTask,
}: TaskInfoFormParams) => {
  const [optionsTask, setOptionsTask] = useState([]);
  const [optionsDescription, setOptionsDescription] = useState([]);
  const [currentTask, setCurrentTask] = useState<Option | null>();
  const [currentDescription, setCurrentDescription] = useState<Option | null>();

  const getData = async () => {
    const defaultTasks = formDataController("task").get();
    const defaultDescriptions = formDataController("description").get();

    setOptionsTask(defaultTasks);
    setOptionsDescription(defaultDescriptions);
  };

  const addData = (type: FormData, newItem: Option) => {
    formDataController(type).save(newItem);

    if (type === "task") setTask(newItem);
    else setDescription(newItem);

    getData();
  };

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
          type === "task" ? currentTask?.value : currentDescription?.value
        );

        if (type === "task") {
          setTask(null)
          setCurrentTask(null)
        }
        else {
          setDescription(null)
          setCurrentDescription(null)
        };

        getData();
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

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
              setCurrentTask(task);
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
              setCurrentDescription(description);
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
