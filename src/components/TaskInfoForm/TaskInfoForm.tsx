/* eslint-disable jsx-a11y/anchor-is-valid */
import Swal from "sweetalert2";

import "./index.css";

import { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import type {Option} from '../../types/Option'
import { BsFillXCircleFill } from "react-icons/bs";


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

  const getData = async () => {
    const defaultTasks = localStorage.getItem("task");
    const defaultDescriptions = localStorage.getItem("description");

    setOptionsTask(defaultTasks ? JSON.parse(defaultTasks) : []);
    setOptionsDescription(defaultDescriptions ? JSON.parse(defaultDescriptions) : []);
  };

  const addData = (type: "task" | "description", newItem: Option) => {
    const currentData = localStorage.getItem(type);
    const options: Option[] = currentData ? JSON.parse(currentData) : [];

    options.push(newItem);
    localStorage.setItem(type, JSON.stringify(options));

    if (type === "task") {
      setTask(newItem);
      return;
    }

    setDescription(newItem);
    getData()
  };

  const clearData = (type: "task" | "description") => {
    localStorage.setItem(type, JSON.stringify([]));

    Swal.fire({
      title: "Attention",
      text: `Clear all saved ${type === 'task' ? 'tasks' : 'descriptions'}`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Clean"
    }).then((result) => {
      if (result.isConfirmed) {
        if (type === "task") setTask(null);
        else setDescription(null);

        getData()

        Swal.fire({
          icon: "success",
        });
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
            onChange={(task) => setTask(task)}
            onCreateOption={(task) =>
              addData("task", {
                value: task.toUpperCase(),
                label: task.toUpperCase(),
              })
            }
            options={optionsTask}
            value={task}
          />
          <BsFillXCircleFill className="button--clear" title="Clear saved tasks" onClick={() => clearData('task')}/>
        </div>
      </div>
      <div className="select-description">
        <label>Description</label>
        <div className="box--select">
          <CreatableSelect
            isClearable
            id="select-description"
            onChange={(description) => setDescription(description)}
            onCreateOption={(description) =>
              addData("description", {
                value: description,
                label: description,
              })
            }
            options={optionsDescription}
            value={description}
          />
          <BsFillXCircleFill className="button--clear" title="Clear saved descriptions" onClick={() => clearData('description')}/>
        </div>
      </div>
    </div>
  );
};
