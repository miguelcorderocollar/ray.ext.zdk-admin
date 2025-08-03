import { ZendeskBaseClient } from "./base";
import { ZendeskUser, ZendeskUserSearchResponse } from "../types";

export class ZendeskUsersClient extends ZendeskBaseClient {
  async searchUsers(query: string): Promise<ZendeskUser[]> {
    const searchTerms = query;
    const endpoint = `/users/search.json?query=${encodeURIComponent(searchTerms)}&per_page=20`;

    const data = await this.makeGetRequest<ZendeskUserSearchResponse>(endpoint, "fetch users");
    return data.users;
  }

  async updateUser(userId: number, updatedFields: Record<string, unknown>): Promise<ZendeskUser> {
    const endpoint = `/users/${userId}.json`;
    const body = { user: updatedFields };

    const data = await this.makePutRequest<{ user: ZendeskUser }>(endpoint, body, "update user");
    return data.user;
  }

  async createUser(name: string, email: string): Promise<ZendeskUser> {
    const endpoint = `/users.json`;
    const body = { user: { name, email, verified: true, skip_verify_email: true } };

    try {
      const data = await this.makePostRequest<{ user: ZendeskUser }>(endpoint, body, "create user");
      return data.user;
    } catch (error) {
      // Special handling for user creation errors
      if (error instanceof Error && error.message.includes("Failed to create user")) {
        throw error;
      }
      throw error;
    }
  }

  async getGroupUsers(groupId: number): Promise<ZendeskUser[]> {
    const endpoint = `/groups/${groupId}/users.json`;

    const data = await this.makeGetRequest<ZendeskUserSearchResponse>(endpoint, "fetch group users");
    return data.users;
  }
}
