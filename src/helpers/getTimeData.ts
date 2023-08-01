import { WorkLog } from "../types/WorkLogs";

export const getTimeData = (logs: WorkLog[]) => {

  let pointedHours = 0
  let pointedMinutes = 0
  let workedHours = 0
  let workedMinutes = 0

  logs?.forEach((log) => {
    const time = log.time.split(' ')
    const dateIsToday = new Date(log.startDate).toLocaleDateString() === new Date().toLocaleDateString()
    
    time.forEach((registry) => {
      if(registry.includes('h')) {
        pointedHours += parseInt(registry.replace('h', ''))
        workedHours += dateIsToday ? parseInt(registry.replace('h', '')) : 0
      }
      else if (registry.includes('m')) {
        pointedMinutes += parseInt(registry.replace('m', ''))
        workedMinutes += dateIsToday ? parseInt(registry.replace('m', '')) : 0
      }
    })
  })

  return {
    pointedHours: `${pointedHours}h ${pointedMinutes}m`,
    workingHoursToday: `${workedHours}h ${workedMinutes}m`
  }
}