import { ApiClient } from "./api-client";

export class AuthenticatedApiClient extends ApiClient {
  constructor(baseUrl: string, token: string) {
    super(baseUrl);
    this.extra.set("Authorization", `Bearer ${token}`);
  }
}
