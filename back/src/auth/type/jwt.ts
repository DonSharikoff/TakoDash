export type JWTPayload = {
    email: string
}
export type RTPayload = {
    id: string
}

export type TokenResponse = {
    jwt: {
        token: string,
        expired: number
    },
    rt: {
        token: string,
        expired: number
    }
};
