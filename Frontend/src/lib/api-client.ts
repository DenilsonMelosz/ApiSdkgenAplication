/* eslint-disable */
import { SdkgenError, SdkgenErrorWithData, SdkgenHttpClient } from "@sdkgen/browser-runtime";

export interface InvalidCredentialsData {
    message: string
}

export interface UserNotFoundData {
    userId: string
}

export interface AccessDeniedData {
    message: string
}

export interface User {
    id: string
    name: string
    email: string
    phone: string
    role: string
}

export interface AuthResponse {
    token: string
    user: User
}

export class InvalidCredentials extends SdkgenErrorWithData<InvalidCredentialsData> {}

export class UserNotFound extends SdkgenErrorWithData<UserNotFoundData> {}

export class AccessDenied extends SdkgenErrorWithData<AccessDeniedData> {}

export class Fatal extends SdkgenError {}

export class ApiClient extends SdkgenHttpClient {
    constructor(baseUrl: string) {
        super(baseUrl, astJson, errClasses);
    }

    signup(args: {name: string, email: string, password: string, phone: string}): Promise<AuthResponse> { return this.makeRequest("signup", args || {}); }
    login(args: {email: string, password: string}): Promise<AuthResponse> { return this.makeRequest("login", args || {}); }
    getProfile(args?: {}): Promise<User> { return this.makeRequest("getProfile", args || {}); }
    logout(args?: {}): Promise<boolean> { return this.makeRequest("logout", args || {}); }
    listUsers(args?: {}): Promise<User[]> { return this.makeRequest("listUsers", args || {}); }
    deleteUser(args: {userId: string}): Promise<boolean> { return this.makeRequest("deleteUser", args || {}); }
    generateNewPassword(args: {userId: string}): Promise<string> { return this.makeRequest("generateNewPassword", args || {}); }
    updateOwnProfile(args: {name: string, phone: string, email: string, password: string}): Promise<User> { return this.makeRequest("updateOwnProfile", args || {}); }
}

const errClasses = {
    InvalidCredentials,
    UserNotFound,
    AccessDenied,
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
        [
            "AccessDenied",
            "AccessDeniedData"
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
            ret: "AuthResponse"
        },
        login: {
            args: {
                email: "string",
                password: "string"
            },
            ret: "AuthResponse"
        },
        getProfile: {
            args: {},
            ret: "User"
        },
        logout: {
            args: {},
            ret: "bool"
        },
        listUsers: {
            args: {},
            ret: "User[]"
        },
        deleteUser: {
            args: {
                userId: "string"
            },
            ret: "bool"
        },
        generateNewPassword: {
            args: {
                userId: "string"
            },
            ret: "string"
        },
        updateOwnProfile: {
            args: {
                name: "string",
                phone: "string",
                email: "string",
                password: "string"
            },
            ret: "User"
        }
    },
    typeTable: {
        InvalidCredentialsData: {
            message: "string"
        },
        UserNotFoundData: {
            userId: "string"
        },
        AccessDeniedData: {
            message: "string"
        },
        User: {
            id: "string",
            name: "string",
            email: "string",
            phone: "string",
            role: "UserRole"
        },
        AuthResponse: {
            token: "string",
            user: "User"
        },
        UserRole: "string"
    }
} as const;
