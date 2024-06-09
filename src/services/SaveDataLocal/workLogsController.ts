import { WorkLog, WorkLogFields, WorkLogs } from "../../types/WorkLogs";

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

  const get = (): {
    logs: WorkLog[]
  } => {
    const defaultLogs = localStorage.getItem(type);

    return {
      logs: defaultLogs ? JSON.parse(defaultLogs) : []
    }
  };

  const clearAll = () => {
    localStorage.setItem(type, JSON.stringify([]));
  }

  const update = (id: string, field: WorkLogFields, value: any) => {
    const currentLogs = localStorage.getItem(type);
    const data = currentLogs ? JSON.parse(currentLogs) as [] : []

    const newLogs = data?.map((data: any) => {
      if(id !== data.id) return data

      return {
        ...data,
        [field]: value
      }
    })

    localStorage.setItem(type, JSON.stringify(newLogs));
  }


  return {
    save,
    remove,
    get,
    clearAll,
    update
  }
}