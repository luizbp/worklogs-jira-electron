import axios from "axios";
import { clientId, clientSecret } from "../../secrets";


export type GetNewTokenData = {
  access_token: string
  refresh_token: string
  expires_in: number
  scope: string
}

type GetNewTokenProps = {
  refreshToken: string
}

export const getNewToken = async ({refreshToken}: GetNewTokenProps) => {
  const { data } = await axios.post<GetNewTokenData>(
    `https://auth.atlassian.com/oauth/token`,
    {
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  return data;
};
