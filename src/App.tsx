/* eslint-disable jsx-a11y/anchor-is-valid */
import "./App.css";
import { TaskInfoForm } from "./components/TaskInfoForm/TaskInfoForm";
import { Timer } from "./components/Timer/Timer";
import ConfigProvider from "./contexts/ConfigContext";
import { ResolutionButton } from "./components/ResolutionButton/ResolutionButton";
import { MiniDashboard } from "./components/MiniDashboard/MiniDashboard";
import { LoginButton } from "./components/LoginButton/LoginButton";

function App() {
  return (
    <div className="App">
      <ConfigProvider>
        <header className="App-header">
          <div className="box-config-buttons">
            <ResolutionButton />
            <LoginButton/>
          </div>
          <MiniDashboard />
          <TaskInfoForm />
          <Timer />
        </header>
      </ConfigProvider>
    </div>
  );
}

export default App;
