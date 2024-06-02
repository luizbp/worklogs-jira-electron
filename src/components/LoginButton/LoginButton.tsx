import { TbLogin } from "react-icons/tb";
import { useConfig } from "../../contexts/ConfigContext";

import './index.css'
import axios from "axios";

const windowCustom: any = window
const ipcRenderer = windowCustom?.ipcRenderer

export const LoginButton = () => {
  const { setTimerMode, timerMode } = useConfig();

  return (
    <>
      <TbLogin title="Minimalist mode" className="button" onClick={() => {
      ipcRenderer.invoke('logon', '')
    }}/>
    <button onClick={async () => {
      const profile = await windowCustom.electronAPI.getSessionJiraData();
      console.log("TCL: LoginButton -> getSessionJiraData", profile)

      const { data } = await axios.post(`https://api.atlassian.com/ex/jira/${profile.accessibleResources[0].id}/rest/api/3/issue/KAN-1/worklog`, {
        "comment": {
          "content": [
            {
              "content": [
                {
                  "text": "I did some work here.",
                  "type": "text"
                }
              ],
              "type": "paragraph"
            }
          ],
          "type": "doc",
          "version": 1
        },
        "started": "2024-06-02T12:34:00.000+0000",
        "timeSpentSeconds": 1000,
      }, {
        headers: {
          'Authorization': `Bearer ${profile.accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'    
        }
      })
      
      console.log("TCL: LoginButton -> data", data)
      
    }}>Teste</button>
    </>
  )
};
