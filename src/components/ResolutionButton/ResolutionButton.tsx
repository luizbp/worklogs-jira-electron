import { TbWindowMaximize, TbWindowMinimize } from "react-icons/tb";
import { useConfig } from "../../contexts/ConfigContext";

import './index.css'
import { Box } from "@mui/material";

export const ResolutionButton = () => {
  const { setTimerMode, timerMode } = useConfig();

  const render = () => {
    if (timerMode === "window") return <TbWindowMinimize title="Minimalist mode" className="button" onClick={() => {
      setTimerMode('minimalist')
    }}/>;
    else return <TbWindowMaximize title="Window mode" className="button" onClick={() => {
      setTimerMode('window')
    }}/>;
  }

  return (
    <Box className="box-resolution-button">
      {render()}
    </Box>
  )
};
