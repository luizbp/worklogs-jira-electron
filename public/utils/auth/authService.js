// services/auth-service.js

const axios = require("axios");
const url = require("url");
const envVariables = require("../../env-variables");
const { randomUUID } = require("crypto");

const { auth0Domain, clientId, clientSecret, api0Domain } = envVariables;

const redirectUri = "http://localhost/callback";

let sessionJiraData = null;

function getSessionJiraData() {
  return sessionJiraData;
}

function getAuthenticationURL() {
  const scopes = "write:jira-work read:me offline_access write:issue-worklog:jira write:issue-worklog.property:jira read:avatar:jira read:group:jira read:issue-worklog:jira read:project-role:jira read:user:jira read:issue-worklog.property:jira"
  return `https://${auth0Domain}/authorize?audience=api.atlassian.com&state=${randomUUID()}&client_id=${clientId}&scope=${scopes}&response_type=code&redirect_uri=${redirectUri}&prompt=consent`;
}

async function loadTokens(callbackURL) {
  const urlParts = url.parse(callbackURL, true);
  const query = urlParts.query;

  const exchangeOptions = {
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    code: query.code,
    redirect_uri: redirectUri,
  };

  const optionsToken = {
    method: "POST",
    url: `https://${auth0Domain}/oauth/token`,
    headers: {
      "content-type": "application/json",
    },
    data: JSON.stringify(exchangeOptions),
  };

  try {
    const responseToken = await axios(optionsToken);

    const optionsCloundId = {
      method: "GET",
      url: `https://${api0Domain}/oauth/token/accessible-resources`,
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${responseToken.data.access_token}`
      }
    };

    const responseCloundId = await axios(optionsCloundId);

    sessionJiraData = {
      accessToken: responseToken.data.access_token,
      refresh_token: responseToken.data.refresh_token,
      expiresIn: responseToken.data.expires_in,
      accessibleResources: responseCloundId?.data?.map((resource, index) => {
        return {
          ...resource,
          selected: index === 0
        }
      })
    }

  } catch (error) {
    await logout();

    throw error;
  }
}


async function logout() {
  sessionJiraData = null;
}

function getLogOutUrl() {
  return `https://${auth0Domain}/v2/logout`;
}

module.exports = {
  getSessionJiraData,
  getAuthenticationURL,
  getLogOutUrl,
  loadTokens,
  logout
};
