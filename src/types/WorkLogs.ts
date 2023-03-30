export type WorkLogs = WorkLog[]

export type WorkLog = {
  id: string
  startDate: string
  startDateFormatted: string
  task: string
  description: string
  time: string
}