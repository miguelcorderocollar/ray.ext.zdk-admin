import { ZendeskBaseClient } from "./base";
import { ZendeskOrganization, ZendeskOrganizationSearchResponse } from "../types";

export class ZendeskOrganizationsClient extends ZendeskBaseClient {
  async searchOrganizations(query: string): Promise<ZendeskOrganization[]> {
    const searchTerms = query;
    const endpoint = `/search.json?query=type:organization ${encodeURIComponent(searchTerms)}&per_page=20`;

    const data = await this.makeGetRequest<ZendeskOrganizationSearchResponse>(endpoint, "fetch organizations");
    return data.results;
  }
}
