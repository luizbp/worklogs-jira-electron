import { WorkLog } from "../types/WorkLogs";

export const getHoursWorked = (logs: WorkLog[]) => {

  let hours = 0
  let minutes = 0

  logs?.forEach((log) => {
    const data = log.time.split(' ')
    data.forEach((registry) => {
      if(registry.includes('h')) hours += parseInt(registry.replace('h', ''));
      else if (registry.includes('m')) minutes += parseInt(registry.replace('m', ''));
    })
  })

  return `${hours}h ${minutes}m`
}