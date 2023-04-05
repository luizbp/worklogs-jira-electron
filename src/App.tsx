/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import "./App.css";
import { TaskInfoForm } from "./components/TaskInfoForm/TaskInfoForm";
import { Timer } from "./components/Timer/Timer";
import type { Option } from "./types/Option";
import { setMinimalistTimerMode, setInitialTimerMode } from "./services/integrationIpcRender";

function App() {
  const [task, setTask] = useState<Option | null>();
  const [showTaskInfoForm, setShowTaskInfoForm] = useState<boolean>(true);
  const [description, setDescription] = useState<Option | null>();

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button
            onClick={() => {
              if (showTaskInfoForm)
                setMinimalistTimerMode({
                  callBack: () => {
                    setShowTaskInfoForm(false);
                  },
                });
              else
                setInitialTimerMode({
                  callBack: () => {
                    setShowTaskInfoForm(true);
                  },
                });
            }}
          >
            hide
          </button>
        </div>
        {showTaskInfoForm && (
          <TaskInfoForm
            description={description}
            task={task}
            setTask={setTask}
            setDescription={setDescription}
          />
        )}
        <Timer description={description} task={task} showButtonViewWorkLogs={showTaskInfoForm} />
      </header>
    </div>
  );
}

export default App;
