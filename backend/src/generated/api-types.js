"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = exports.ApiConfig = exports.UserNotFound = exports.InvalidCredentials = exports.Fatal = void 0;
/* eslint-disable */
const node_runtime_1 = require("@sdkgen/node-runtime");
var node_runtime_2 = require("@sdkgen/node-runtime");
Object.defineProperty(exports, "Fatal", { enumerable: true, get: function () { return node_runtime_2.Fatal; } });
class InvalidCredentials extends node_runtime_1.SdkgenErrorWithData {
}
exports.InvalidCredentials = InvalidCredentials;
class UserNotFound extends node_runtime_1.SdkgenErrorWithData {
}
exports.UserNotFound = UserNotFound;
class ApiConfig extends node_runtime_1.BaseApiConfig {
    constructor() {
        super(...arguments);
        this.astJson = {
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
        };
    }
}
exports.ApiConfig = ApiConfig;
exports.api = new ApiConfig();
//# sourceMappingURL=api-types.js.map