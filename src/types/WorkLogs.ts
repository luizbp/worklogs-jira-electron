export type WorkLogs = WorkLog[]

export type WorkLog = {
  id: string
  startDate: string
  startDateFormatted: string
  task: string
  description: string
  time: string
  integration?: IntegrationData
}

export type WorkLogFields = 'id' | 'startDate' | 'startDateFormatted' | 'task' | 'description' | 'time' | 'integration'

export type IntegrationData = {
  registered: boolean
  msg?: string
  loading?: boolean
}

export interface CreateWorkLog {
  author: Author
  created: string
  id: string
  issueId: string
  properties: Property[]
  self: string
  started: string
  timeSpent: string
  timeSpentSeconds: number
  updateAuthor: UpdateAuthor
  updated: string
  visibility: Visibility
}

export interface Author {
  accountId: string
  accountType: string
  active: boolean
  avatarUrls: AvatarUrls
  displayName: string
  emailAddress: string
  key: string
  name: string
  self: string
  timeZone: string
}

export interface AvatarUrls {
  "16x16": string
  "24x24": string
  "32x32": string
  "48x48": string
}

export interface Property {
  key: string
}

export interface UpdateAuthor {
  accountId: string
  accountType: string
  active: boolean
  avatarUrls: AvatarUrls2
  displayName: string
  emailAddress: string
  key: string
  name: string
  self: string
  timeZone: string
}

export interface AvatarUrls2 {
  "16x16": string
  "24x24": string
  "32x32": string
  "48x48": string
}

export interface Visibility {
  identifier: string
  type: string
  value: string
}
