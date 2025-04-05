/* eslint-disable */
import { SdkgenError, SdkgenErrorWithData, SdkgenHttpClient } from "@sdkgen/browser-runtime";

export interface InvalidCredentialsData {
    message: string
}

export interface UserNotFoundData {
    userId: string
}

export interface User {
    id: string
    name: string
    email: string
    phone: string
}

export class InvalidCredentials extends SdkgenErrorWithData<InvalidCredentialsData> {}

export class UserNotFound extends SdkgenErrorWithData<UserNotFoundData> {}

export class Fatal extends SdkgenError {}

export class ApiClient extends SdkgenHttpClient {
    constructor(baseUrl: string) {
        super(baseUrl, astJson, errClasses);
    }

    signup(args: {name: string, email: string, password: string, phone: string}): Promise<User> { return this.makeRequest("signup", args || {}); }
    login(args: {email: string, password: string}): Promise<User> { return this.makeRequest("login", args || {}); }
    getProfile(args: {userId: string}): Promise<User> { return this.makeRequest("getProfile", args || {}); }
    logout(args?: {}): Promise<boolean> { return this.makeRequest("logout", args || {}); }
}

const errClasses = {
    InvalidCredentials,
    UserNotFound,
    Fatal
};

const astJson = {
    annotations: {},
    errors: [
        [
            "InvalidCredentials",
            "InvalidCredentialsData"
        ],
        [
            "UserNotFound",
            "UserNotFoundData"
        ],
        "Fatal"
    ],
    functionTable: {
        signup: {
            args: {
                name: "string",
                email: "string",
                password: "string",
                phone: "string"
            },
            ret: "User"
        },
        login: {
            args: {
                email: "string",
                password: "string"
            },
            ret: "User"
        },
        getProfile: {
            args: {
                userId: "string"
            },
            ret: "User"
        },
        logout: {
            args: {},
            ret: "bool"
        }
    },
    typeTable: {
        InvalidCredentialsData: {
            message: "string"
        },
        UserNotFoundData: {
            userId: "string"
        },
        User: {
            id: "string",
            name: "string",
            email: "string",
            phone: "string"
        }
    }
} as const;
