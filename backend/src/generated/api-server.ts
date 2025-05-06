/* eslint-disable */
import { BaseApiConfig, Context, Fatal, SdkgenErrorWithData } from "@sdkgen/node-runtime";
export { Fatal } from "@sdkgen/node-runtime";

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

export interface AuthResponse {
    token: string
    user: User
}

export class InvalidCredentials extends SdkgenErrorWithData<InvalidCredentialsData> {}

export class UserNotFound extends SdkgenErrorWithData<UserNotFoundData> {}

export class ApiConfig<ExtraContextT> extends BaseApiConfig<ExtraContextT> {
    declare fn: {
        signup: (ctx: Context & ExtraContextT, args: {name: string, email: string, password: string, phone: string}) => Promise<AuthResponse>
        login: (ctx: Context & ExtraContextT, args: {email: string, password: string}) => Promise<AuthResponse>
        getProfile: (ctx: Context & ExtraContextT, args: {}) => Promise<User>
        logout: (ctx: Context & ExtraContextT, args: {}) => Promise<boolean>
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
            },
            AuthResponse: {
                token: "string",
                user: "User"
            }
        }
    } as const
}

export const api = new ApiConfig<{}>();
