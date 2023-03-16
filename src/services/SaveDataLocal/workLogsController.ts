import { WorkLog, WorkLogs } from "../../types/WorkLogs";

type FunctionSaveParams = {
  newItem: WorkLog
}

export const workLogsController = () => {

  const type = 'logs'

  const save = ({newItem}: FunctionSaveParams) => {
    const currentData = localStorage.getItem(type);
    const logs: WorkLogs = currentData ? JSON.parse(currentData) : [];

    logs.push(newItem);
    localStorage.setItem(type, JSON.stringify(logs));
  };

  const remove = (id: string) => {
    const currentLogs = localStorage.getItem(type);
    const data = currentLogs ? JSON.parse(currentLogs) as [] : []

    const newLogs = data?.filter(({id: currentId}) => currentId !== id)

    localStorage.setItem(type, JSON.stringify(newLogs));
  } 

  const get = () => {
    const defaultLogs = localStorage.getItem(type);

    return {
      logs: defaultLogs ? JSON.parse(defaultLogs) : []
    }
  };


  return {
    save,
    remove,
    get
  }
}