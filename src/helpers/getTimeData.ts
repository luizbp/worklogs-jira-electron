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
        let currentMinutes = parseInt(registry.replace('m', ''))
        const hoursByMinutes = parseInt((currentMinutes / 60).toFixed(0))

        if(hoursByMinutes > 0) {
          currentMinutes -= 60 * hoursByMinutes
          
          pointedHours += hoursByMinutes
          workedHours += dateIsToday ? hoursByMinutes : 0

        }

        pointedMinutes += currentMinutes
        workedMinutes += dateIsToday ? currentMinutes : 0
      }
    })
  })


  const isSixtyMinutePointed = pointedMinutes === 60
  const isSixtyMinuteWorked = workedMinutes === 60

  return {
    pointedHours: `${pointedHours + (isSixtyMinutePointed ? 1 : 0)}h ${isSixtyMinutePointed ? 0 : pointedMinutes}m`,
    workingHoursToday: `${workedHours + (isSixtyMinuteWorked ? 1 : 0)}h ${isSixtyMinuteWorked ? 0 : workedMinutes}m`
  }
}