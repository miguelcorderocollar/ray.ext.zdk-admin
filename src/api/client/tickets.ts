import { ZendeskBaseClient } from "./base";
import { ZendeskTicket, ZendeskTicketSearchResponse } from "../types";

export class ZendeskTicketsClient extends ZendeskBaseClient {
  async searchTickets(
    query: string,
    filters?: {
      userEmail?: string;
      groupId?: string;
      organizationId?: string;
      brandId?: string;
      formId?: string;
      recipient?: string;
      roleId?: string;
    },
  ): Promise<ZendeskTicket[]> {
    let searchTerms = query ? `type:ticket ${query}` : "type:ticket";

    if (filters?.userEmail) {
      searchTerms += ` requester:${filters.userEmail}`;
    }
    if (filters?.groupId) {
      searchTerms += ` group:${filters.groupId}`;
    }
    if (filters?.organizationId) {
      searchTerms += ` organization:${filters.organizationId}`;
    }
    if (filters?.brandId) {
      searchTerms += ` brand:${filters.brandId}`;
    }
    if (filters?.formId) {
      searchTerms += ` form:${filters.formId}`;
    }
    if (filters?.recipient) {
      searchTerms += ` recipient:${filters.recipient}`;
    }
    if (filters?.roleId) {
      searchTerms += ` role:${filters.roleId}`;
    }

    const endpoint = `/search.json?query=${encodeURIComponent(searchTerms)}&per_page=30`;

    const data = await this.makeGetRequest<ZendeskTicketSearchResponse>(endpoint, "fetch tickets");
    return data.results;
  }
}
