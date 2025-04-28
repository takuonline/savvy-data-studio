export type AuthLoginCredentials = {
    username: string;
    password: string;
};
export type AuthSignupCredentials = {
    username: string;
    password: string;
    email: string;
};

export type AuthTokens = {
    access?: string;
    refresh?: string;
};
