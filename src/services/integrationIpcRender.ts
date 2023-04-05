const windowCustom: any = window
const ipcRenderer = windowCustom?.ipcRenderer

type SetMinimalistTimerModeParams = {
  callBack: Function
}
export const setMinimalistTimerMode = ({callBack}:SetMinimalistTimerModeParams) => {
  callBack()
  ipcRenderer.invoke('set-minimalist-timer-mode', '')
}

type SetInitialTimerModeParams = {
  callBack: Function
}
export const setInitialTimerMode = ({callBack}:SetInitialTimerModeParams) => {
  callBack()
  ipcRenderer.invoke('set-initial-timer-mode', '')
}