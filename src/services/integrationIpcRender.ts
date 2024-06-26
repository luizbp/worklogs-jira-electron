const windowCustom: any = window
const ipcRenderer = windowCustom?.ipcRenderer

type SetMinimalistTimerModeParams = {
  callBack?: Function
}
export const setMinimalistTimerMode = ({callBack}:SetMinimalistTimerModeParams) => {
  if(callBack) callBack()
  ipcRenderer.invoke('set-minimalist-timer-mode', '')
}

type SetInitialTimerModeParams = {
  callBack?: Function
}
export const setInitialTimerMode = ({callBack}:SetInitialTimerModeParams) => {
  if(callBack) callBack()
  ipcRenderer.invoke('set-initial-timer-mode', '')
}

type HandleLoginProps = {
  callBack?: Function
}

export const handleLogin = (props?:HandleLoginProps) => {
  if(props?.callBack) props.callBack()
  ipcRenderer.invoke("auth:logon", "");
}