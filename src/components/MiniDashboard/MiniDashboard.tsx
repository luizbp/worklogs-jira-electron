import "./index.css";

import { MdWorkHistory } from "react-icons/md";

type MiniDashboardProps = {
  workedHours: string;
};

export const MiniDashboard = ({ workedHours }: MiniDashboardProps) => {
  return (
    <div className="mini-dashboard">
      <div className="mini-dashboard--worked-hours">
        <MdWorkHistory className="mini-dashboard--worked-hours-icon"/>
        <p className="mini-dashboard--worked-hours-value">{workedHours}</p>
      </div>
    </div>
  );
};
