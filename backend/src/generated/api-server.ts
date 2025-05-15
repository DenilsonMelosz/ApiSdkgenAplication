/* eslint-disable */
import { BaseApiConfig, Context, Fatal, SdkgenErrorWithData } from "@sdkgen/node-runtime";
export { Fatal } from "@sdkgen/node-runtime";

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

export class ApiConfig<ExtraContextT> extends BaseApiConfig<ExtraContextT> {
    declare fn: {
        signup: (ctx: Context & ExtraContextT, args: {name: string, email: string, password: string, phone: string}) => Promise<AuthResponse>
        login: (ctx: Context & ExtraContextT, args: {email: string, password: string}) => Promise<AuthResponse>
        getProfile: (ctx: Context & ExtraContextT, args: {}) => Promise<User>
        logout: (ctx: Context & ExtraContextT, args: {}) => Promise<boolean>
        listUsers: (ctx: Context & ExtraContextT, args: {}) => Promise<User[]>
        deleteUser: (ctx: Context & ExtraContextT, args: {userId: string}) => Promise<boolean>
        generateNewPassword: (ctx: Context & ExtraContextT, args: {userId: string}) => Promise<string>
        updateOwnProfile: (ctx: Context & ExtraContextT, args: {name: string, phone: string, email: string, password: string}) => Promise<User>
    }

    astJson = {
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
    } as const
}

export const api = new ApiConfig<{}>();
