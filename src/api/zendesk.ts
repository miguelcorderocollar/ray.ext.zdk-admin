import { getZendeskPreferences } from "../utils/preferences";

export interface ZendeskUser {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  time_zone?: string;
  locale?: string;
  role?: string;
  verified?: boolean;
  active?: boolean;
  details?: string;
  notes?: string;
  phone?: string;
  photo?: {
    url: string;
    id: number;
    file_name: string;
    content_url: string;
    mapped_content_url: string;
    content_type: string;
    size: number;
    width: number;
    height: number;
    inline: boolean;
    deleted: boolean;
    thumbnails: Array<{
      url: string;
      id: number;
      file_name: string;
      content_url: string;
      mapped_content_url: string;
      content_type: string;
      size: number;
      width: number;
      height: number;
      inline: boolean;
      deleted: boolean;
    }>;
  };
}

export interface ZendeskOrganization {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  domain_names?: string[];
  details?: string;
  notes?: string;
  shared_tickets?: boolean;
  shared_comments?: boolean;
  external_id?: string;
}

interface ZendeskUserSearchResponse {
  users: ZendeskUser[];
  count: number;
}

interface ZendeskOrganizationSearchResponse {
  results: ZendeskOrganization[];
  count: number;
}

export function getZendeskAuthHeader(): string {
  const { zendeskEmail, zendeskApiToken } = getZendeskPreferences();
  const credentials = `${zendeskEmail}/token:${zendeskApiToken}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}

export function getZendeskUrl(): string {
  const { zendeskSubdomain } = getZendeskPreferences();
  return `https://${zendeskSubdomain}.zendesk.com/api/v2`;
}

export async function searchZendeskUsers(query: string): Promise<ZendeskUser[]> {
  const searchTerms = query;
  const url = `${getZendeskUrl()}/users/search.json?query=${encodeURIComponent(searchTerms)}&per_page=10`;
  console.log("Zendesk Search URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(),
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as ZendeskUserSearchResponse;
  return data.users;
}

export async function searchZendeskOrganizations(query: string): Promise<ZendeskOrganization[]> {
  const searchTerms = query;
  const url = `${getZendeskUrl()}/search.json?query=type:organization ${encodeURIComponent(searchTerms)}&per_page=10`;
  console.log("Zendesk Organization Search URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(),
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
  }

  const data = (await response.json()) as ZendeskOrganizationSearchResponse;
  return data.results;
}