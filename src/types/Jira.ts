export type SessionJiraDataType = {
    accessToken: string
    refresh_token: string
    expiresIn: string
    accessibleResources: AccessibleResourcesType[]
}

type AccessibleResourcesType = {
    id: string
    name: string
    url: string
    scopes: string[]
    avatarUrl: string
    selected: boolean
}

export type UserLogged = {
    userName: string
    userPicture: string
}