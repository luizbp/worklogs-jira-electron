import { TbWindowMaximize, TbWindowMinimize } from "react-icons/tb";
import { useConfig } from "../../contexts/ConfigContext";

import './index.css'

export const ResolutionButton = () => {
  const { setTimerMode, timerMode } = useConfig();

  if (timerMode === "window") return <TbWindowMinimize title="Minimalist mode" className="button" onClick={() => {
    setTimerMode('minimalist')
  }}/>;
  else return <TbWindowMaximize title="Window mode" className="button" onClick={() => {
    setTimerMode('window')
  }}/>;
};
