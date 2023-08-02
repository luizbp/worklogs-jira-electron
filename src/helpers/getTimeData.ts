import { WorkLog } from "../types/WorkLogs";


type GetPointFormatedParams = {
  hours: number
  minutes: number
}

const formatResult = ({hours, minutes}:GetPointFormatedParams) => {
  const hoursByMinutes = parseInt(`${minutes / 60}`)

  if(hoursByMinutes > 0) {
    minutes -= 60 * hoursByMinutes
    
    hours += hoursByMinutes

    if(minutes === 60) {
      minutes = 0
      hours += 1 
    }
  }

  return {
    hours,
    minutes
  }
}

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

        pointedMinutes += currentMinutes
        workedMinutes += dateIsToday ? currentMinutes : 0
      }
    })
  })

  const pointedHoursFormated = formatResult({
    hours: pointedHours,
    minutes: pointedMinutes
  })
  const workingHoursTodayFormated = formatResult({
    hours: workedHours,
    minutes: workedMinutes
  })
  
  return {
    pointedHours: `${pointedHoursFormated.hours}h ${pointedHoursFormated.minutes}m`,
    workingHoursToday: `${workingHoursTodayFormated.hours}h ${workingHoursTodayFormated.minutes}m`
  }
}