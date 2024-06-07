import React, { createContext, useContext, useEffect, useState } from "react";
import { TimerMode } from "../types/configs";
import {
  setInitialTimerMode,
  setMinimalistTimerMode,
} from "../services/integrationIpcRender";

import type { Option } from "../types/Option";
import type { FormData } from "../types/FormData";
import { formDataController } from "../services/SaveDataLocal/formDataController";
import { workLogsController } from "../services/SaveDataLocal/workLogsController";
import { WorkLogs } from "../types/WorkLogs";
import { getTimeData } from "../helpers/getTimeData";

interface ConfigValue {
  timerMode: TimerMode | undefined;
  setTimerMode: (timerMode: TimerMode) => void;
  task: Option | null | undefined;
  description: Option | null | undefined;
  logs: WorkLogs;
  setLogs: (logs: WorkLogs) => any;
  setTask: (task: Option | null) => any;
  setDescription: (description: Option | null) => any;
  optionsTask: Array<any>;
  optionsDescription: Array<any>;
  getData: () => void;
  addData: (type: FormData, newItem: Option) => void;
  getWorkLog: () => void;
  workedHours: string;
  pointedHours: string;
}

const ConfigContext = createContext<ConfigValue | null>(null);

const ConfigProvider = ({ children }: any) => {
  const [timerMode, setTimerMode] = useState<TimerMode>("window");
  const [task, setTask] = useState<Option | null>();
  const [logs, setLogs] = useState<WorkLogs>([]);
  const [description, setDescription] = useState<Option | null>();
  const [optionsTask, setOptionsTask] = useState([]);
  const [optionsDescription, setOptionsDescription] = useState([]);
  const [workedHours, setWorkedHours] = useState("");
  const [pointedHours, setPointedHours] = useState("");

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

  const getWorkLog = async () => {
    const workLog = workLogsController();

    const { logs: defaultLogs } = workLog.get();
    const timeData = getTimeData(defaultLogs);
    setWorkedHours(timeData.workingHoursToday);
    setPointedHours(timeData.pointedHours);

    setLogs(defaultLogs);
  };

  useEffect(() => {
    if (timerMode === "minimalist") setMinimalistTimerMode({});
    else setInitialTimerMode({});

    getData();
    getWorkLog();
  }, [timerMode]);

  return (
    <ConfigContext.Provider
      value={{
        timerMode,
        setTimerMode,
        task,
        setTask,
        description,
        setDescription,
        getData,
        addData,
        optionsDescription,
        optionsTask,
        logs,
        setLogs,
        getWorkLog,
        workedHours,
        pointedHours,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export function useConfig() {
  const context = useContext(ConfigContext);

  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }

  return context;
}

export default ConfigProvider;
