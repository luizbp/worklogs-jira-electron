import { useConfig } from "../../contexts/ConfigContext";
import "./index.css";

import { MdWorkHistory } from "react-icons/md";

export const MiniDashboard = () => {
  const {
    workedHours
  } = useConfig();
  
  return (
    <div className="mini-dashboard">
      <div className="mini-dashboard--worked-hours" title="Horas trabalhadas">
        <MdWorkHistory className="mini-dashboard--worked-hours-icon"/>
        <p className="mini-dashboard--worked-hours-value">{workedHours}</p>
      </div>
    </div>
  );
};
