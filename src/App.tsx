/* eslint-disable jsx-a11y/anchor-is-valid */
import "./App.css";
import { TaskInfoForm } from "./components/TaskInfoForm/TaskInfoForm";
import { Timer } from "./components/Timer/Timer";
import ConfigProvider from "./contexts/ConfigContext";
import { ResolutionButton } from "./components/ResolutionButton/ResolutionButton";
import { MiniDashboard } from "./components/MiniDashboard/MiniDashboard";
import { LoginComponent } from "./components/LoginComponent/LoginComponent";
import JiraProvider from "./contexts/JiraContext";

function App() {
  return (
    <div className="App">
      <ConfigProvider>
        <JiraProvider>
          <header className="App-header">
            <div className="box-config-buttons">
              <ResolutionButton />
              <LoginComponent />
            </div>
            <MiniDashboard />
            <TaskInfoForm />
            <Timer />
          </header>
        </JiraProvider>
      </ConfigProvider>
    </div>
  );
}

export default App;
