/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import "./App.css";
import { TaskInfoForm } from "./components/TaskInfoForm/TaskInfoForm";
import { Timer } from "./components/Timer/Timer";
import type { Option } from "./types/Option";
import ConfigProvider from "./contexts/ConfigContext";
import { ResolutionButton } from "./components/ResolutionButton/ResolutionButton";

function App() {
  const [task, setTask] = useState<Option | null>();
  const [description, setDescription] = useState<Option | null>();

  return (
    <div className="App">
      <ConfigProvider>
        <header className="App-header">
          <div className="box-config-buttons">
            <ResolutionButton/>
          </div>
            <TaskInfoForm
              description={description}
              task={task}
              setTask={setTask}
              setDescription={setDescription}
            />
          <Timer
            description={description}
            task={task}
          />
        </header>
      </ConfigProvider>
    </div>
  );
}

export default App;
