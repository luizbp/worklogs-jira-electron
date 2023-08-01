import { useConfig } from "../../contexts/ConfigContext";
import "./index.css";

import { MdWorkHistory, MdEditDocument} from "react-icons/md";

export const MiniDashboard = () => {
  const {
    workedHours,
    pointedHours
  } = useConfig();
  
  return (
    <div className="mini-dashboard">
      <div className="mini-dashboard--worked-hours" title="Horas trabalhadas hoje">
        <MdWorkHistory className="mini-dashboard--worked-hours-icon"/>
        <p className="mini-dashboard--worked-hours-value">{workedHours}</p>
      </div>
      <div className="mini-dashboard--pointed-hours" title="Horas apontadas">
        <MdEditDocument className="mini-dashboard--pointed-hours-icon"/>
        <p className="mini-dashboard--pointed-hours-value">{pointedHours}</p>
      </div>
    </div>
  );
};
