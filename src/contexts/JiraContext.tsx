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
import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { SessionJiraDataType, UserLogged } from "../types/Jira";

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

type CreateWorkLogParams = {
  task: string;
  description: string;
  time: string;
  started: string;
  cloudId: string;
};

interface JiraValue {
  sessionJiraData: SessionJiraDataType | null | undefined;
  setSessionJiraData: (sessionJiraData: SessionJiraDataType | null) => any;
  userLogged: UserLogged | null | undefined;
  setUserLogged: (userLogged: UserLogged | null) => any;
  getProfileData: () => Promise<Profile | null>
  createWorkLog: (props: CreateWorkLogParams) => void
}

const JiraContext = createContext<JiraValue | null>(null);

const JiraProvider = ({ children }: any) => {
  const [sessionJiraData, setSessionJiraData] =
    useLocalStorage<SessionJiraDataType | null>(
      "worlogs-jira-session-data",
      null
    );
  const [userLogged, setUserLogged] = useState<UserLogged | null>(null);

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

        return axiosPersist.request(config);
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
      }
    );

    return data;
  };

  const createWorkLog = async ({
    description,
    task,
    time,
    started,
    cloudId,
  }: CreateWorkLogParams) => {
    if (!sessionJiraData) throw new Error("Token not is valid");
    if (!description) throw new Error("Description not informed");
    if (!task) throw new Error("Task not informed");
    if (!time) throw new Error("Time not informed");
    if (!cloudId) throw new Error("cloudId not informed");
    if (!started) started = new Date().toISOString();

    return axios.post(
      `https://api.atlassian.com/ex/jira/${cloudId}/rest/3/issue/${task}/worklog`,
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
      }
    );
  };

  useEffect(() => {
    if(sessionJiraData) {
      getProfileData()
        .then((data) => {
          setUserLogged({
            userName: data?.name || '',
            userPicture: data?.picture || '',
          });
        })
        .catch((error) => {
          console.error("TCL: LoginComponent -> error", error);
        })
    }
  },[])

  return (
    <JiraContext.Provider
      value={{
        sessionJiraData,
        setSessionJiraData,
        userLogged,
        setUserLogged,
        getProfileData,
        createWorkLog
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
