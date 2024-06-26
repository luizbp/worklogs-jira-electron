/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import axios from "axios";
import { getNewToken } from "../services/Jira/getNewToken";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { SessionJiraDataType, UserLogged } from "../types/Jira";
import { CreateWorkLog, WorkLog } from "../types/WorkLogs";
import { workLogsController } from "../services/SaveDataLocal/workLogsController";
import Swal from "sweetalert2";

export interface PersistConfig extends AxiosRequestConfig {
  retry?: number;
}

export interface Profile {
  account_type: string;
  account_id: string;
  email: string;
  name: string;
  picture: string;
  account_status: string;
  nickname: string;
  zoneinfo: string;
  locale: string;
  extended_profile: ExtendedProfile;
}

export interface ExtendedProfile {
  job_title: string;
  organization: string;
  department: string;
  location: string;
}

type RegisterWorkLogInJiraProps = {
  task: string;
  description: string;
  time: string;
  started: string;
  cloudId: string;
};

type CreateWorkLogProps = {
  workLog: WorkLog;
  callbackIntegrationError?: Function;
};

interface JiraValue {
  sessionJiraData: SessionJiraDataType | null | undefined;
  setSessionJiraData: (sessionJiraData: SessionJiraDataType | null) => any;
  userLogged: UserLogged | null | undefined;
  setUserLogged: (userLogged: UserLogged | null) => any;
  getProfileData: () => Promise<Profile | null>;
  createWorkLog: (props: CreateWorkLogProps) => Promise<{
    integratedWorkLog: boolean;
  }>;
  registerWorkLogInJira: (
    props: RegisterWorkLogInJiraProps
  ) => Promise<AxiosResponse<CreateWorkLog, any>>;
  cloudIdSelected: React.MutableRefObject<string | null>;
}

const JiraContext = createContext<JiraValue | null>(null);

const JiraProvider = ({ children }: any) => {
  const [sessionJiraData, setSessionJiraData] =
    useLocalStorage<SessionJiraDataType | null>(
      "worlogs-jira-session-data",
      null
    );
  const [userLogged, setUserLogged] = useState<UserLogged | null>(null);
  const cloudIdSelected = useRef<string | null>(null);

  const axiosPersist: AxiosInstance = axios.create();

  axiosPersist.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (err: AxiosError) => {
      const {
        request: { status },
      } = err;

      const config = err.config as PersistConfig;
      if (
        config?.retry &&
        config.retry - 1 > 0 &&
        status === 401 &&
        sessionJiraData
      ) {
        config.retry -= 1;

        const data = await getNewToken({
          refreshToken: sessionJiraData.refresh_token,
        });

        setSessionJiraData({
          ...sessionJiraData,
          accessToken: data.access_token,
          refresh_token: data.refresh_token,
        });

        return axiosPersist.request({
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${data.access_token}`,
          },
        });
      }

      return Promise.reject(err);
    }
  );

  const getProfileData = async () => {
    if (!sessionJiraData) throw new Error("Token not found");

    const { data } = await axiosPersist.get<Profile>(
      `https://api.atlassian.com/me`,
      {
        headers: {
          Authorization: `Bearer ${sessionJiraData.accessToken}`,
          Accept: "application/json",
        },
        retry: 2,
      } as PersistConfig
    );

    return data;
  };

  const registerWorkLogInJira = async ({
    description,
    task,
    time,
    started,
    cloudId,
  }: RegisterWorkLogInJiraProps) => {
    if (!sessionJiraData) throw new Error("Token not is valid");
    if (!description) throw new Error("Description not informed");
    if (!task) throw new Error("Task not informed");
    if (!time) throw new Error("Time not informed");
    if (!cloudId) throw new Error("cloudId not informed");
    if (!started) started = new Date().toISOString();

    return axiosPersist.post<CreateWorkLog>(
      `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue/${task}/worklog`,
      {
        timeSpent: time,
        comment: {
          version: 1,
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: description,
                },
              ],
            },
          ],
        },
        started,
      },
      {
        headers: {
          Authorization: `Bearer ${sessionJiraData.accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        retry: 2,
      } as PersistConfig
    );
  };

  const createWorkLog = async ({
    workLog,
    callbackIntegrationError,
  }: CreateWorkLogProps) => {
    let result = true;
    const controller = workLogsController();

    let newItem = {
      id: Date.now().toString(),
      startDate: workLog.startDate,
      startDateFormatted: workLog.startDateFormatted,
      description: workLog.description,
      task: workLog.task,
      time: workLog.time,
    } as WorkLog;

    try {
      if (cloudIdSelected.current && userLogged) {
        await registerWorkLogInJira({
          description: newItem.description,
          started: newItem.startDate.replaceAll("Z", "+0000"),
          task: newItem.task,
          time: newItem.time,
          cloudId: cloudIdSelected.current,
        });

        newItem.integration = {
          registered: true,
          msg: "Successfully registered",
        };
      }
    } catch (err: any) {
      let msg = err?.response?.data?.message;
      msg = msg ?? err?.response?.data?.errorMessages?.join(" - ");
      msg = msg ?? "Error";

      Swal.fire({
        title: "Error in integration with Jira",
        html: `
          <p><b>Your work log was processed successfully</b>, but an error occurred when trying to post it to Jira, please try again in the work log window</p>
          <p>
            <b>Error message: </b><br/>
            <span style="color: red;">${msg}</span>
          </p>
        `,
        icon: "error",
      }).then(() => {
        if (callbackIntegrationError) callbackIntegrationError();
      });

      newItem.integration = {
        registered: false,
        msg,
      };

      result = false;
    }

    controller.save({
      newItem,
    });

    return {
      integratedWorkLog: result,
    };
  };

  useEffect(() => {
    if (sessionJiraData) {
      getProfileData()
        .then((data) => {
          setUserLogged({
            userName: data?.name || "",
            userPicture: data?.picture || "",
          });
        })
        .catch((error) => {
          console.error("TCL: LoginComponent -> error", error);
        });
    }
  }, []);

  useEffect(() => {
    if (sessionJiraData) {
      cloudIdSelected.current =
        sessionJiraData.accessibleResources.find(
          (resource) => resource.selected
        )?.id ?? null;
    }
  }, [sessionJiraData]);

  return (
    <JiraContext.Provider
      value={{
        sessionJiraData,
        setSessionJiraData,
        userLogged,
        setUserLogged,
        getProfileData,
        createWorkLog,
        registerWorkLogInJira,
        cloudIdSelected,
      }}
    >
      {children}
    </JiraContext.Provider>
  );
};

export function useJira() {
  const context = useContext(JiraContext);

  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }

  return context;
}

export default JiraProvider;
