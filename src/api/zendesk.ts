import { showToast, Toast } from "@raycast/api";
import { getZendeskPreferences } from "../utils/preferences";

export interface ZendeskUser {
  id: number;
  name: string;
  email: string;
  alias?: string;
  tags?: string[];
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

export interface ZendeskTrigger {
  url: string;
  id: number;
  title: string;
  active: boolean;
  updated_at: string;
  created_at: string;
  default: boolean;
  actions: Array<{ field: string; value: string | string[] }>;
  conditions: { all: Array<unknown>; any: Array<unknown> };
  description: string | null;
  position: number;
  raw_title: string;
  category_id: string;
}

interface ZendeskTriggerSearchResponse {
  triggers: ZendeskTrigger[];
  count: number;
}

interface ZendeskOrganizationSearchResponse {
  results: ZendeskOrganization[];
  count: number;
}

export interface ZendeskDynamicContent {
  id: number;
  name: string;
  placeholder: string;
  default_locale_id: number;
  created_at: string;
  updated_at: string;
  variants: ZendeskDynamicContentVariant[];
}

export interface ZendeskDynamicContentVariant {
  id: number;
  locale_id: number;
  active: boolean;
  default: boolean;
  content: string;
  created_at: string;
  updated_at: string;
}

interface ZendeskDynamicContentSearchResponse {
  items: ZendeskDynamicContent[];
}

export interface ZendeskMacro {
  url: string;
  id: number;
  title: string;
  active: boolean;
  updated_at: string;
  created_at: string;
  usage_count: number;
  description: string | null;
}

interface ZendeskMacroSearchResponse {
  macros: ZendeskMacro[];
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
  const url = `${getZendeskUrl()}/users/search.json?query=${encodeURIComponent(searchTerms)}&per_page=20`;
  console.log("Zendesk Search URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(),
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      showToast(Toast.Style.Failure, "Zendesk API Error", `Failed to fetch users: ${response.status} - ${errorText}`);
      throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as ZendeskUserSearchResponse;
    return data.users;
  } catch (error) {
    showToast(
      Toast.Style.Failure,
      "Connection Error",
      "Could not connect to Zendesk API. Please check your internet connection or API settings.",
    );
    throw error;
  }
}

export async function searchZendeskOrganizations(query: string): Promise<ZendeskOrganization[]> {
  const searchTerms = query;
  const url = `${getZendeskUrl()}/search.json?query=type:organization ${encodeURIComponent(searchTerms)}&per_page=20`;
  console.log("Zendesk Organization Search URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(),
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      showToast(
        Toast.Style.Failure,
        "Zendesk API Error",
        `Failed to fetch organizations: ${response.status} - ${errorText}`,
      );
      throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as ZendeskOrganizationSearchResponse;
    return data.results;
  } catch (error) {
    showToast(
      Toast.Style.Failure,
      "Connection Error",
      "Could not connect to Zendesk API. Please check your internet connection or API settings.",
    );
    throw error;
  }
}

export async function searchZendeskTriggers(query: string): Promise<ZendeskTrigger[]> {
  const searchTerms = query;
  const url = `${getZendeskUrl()}/triggers/search.json?query=${encodeURIComponent(searchTerms)}`;
  console.log("Zendesk Trigger Search URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(),
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      showToast(
        Toast.Style.Failure,
        "Zendesk API Error",
        `Failed to fetch triggers: ${response.status} - ${errorText}`,
      );
      throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as ZendeskTriggerSearchResponse;
    return data.triggers;
  } catch (error) {
    showToast(
      Toast.Style.Failure,
      "Connection Error",
      "Could not connect to Zendesk API. Please check your internet connection or API settings.",
    );
    throw error;
  }
}

export async function updateUser(userId: number, updatedFields: Record<string, unknown>): Promise<ZendeskUser> {
  const url = `${getZendeskUrl()}/users/${userId}.json`;
  console.log("Zendesk Update User URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(),
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({ user: updatedFields }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      showToast(Toast.Style.Failure, "Zendesk API Error", `Failed to update user: ${response.status} - ${errorText}`);
      throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as { user: ZendeskUser };
    return data.user;
  } catch (error) {
    showToast(
      Toast.Style.Failure,
      "Connection Error",
      "Could not connect to Zendesk API. Please check your internet connection or API settings.",
    );
    throw error;
  }
}

export async function searchZendeskDynamicContent(query: string): Promise<ZendeskDynamicContent[]> {
  const url = `${getZendeskUrl()}/dynamic_content/items.json`;
  console.log("Zendesk Dynamic Content Search URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(),
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      showToast(
        Toast.Style.Failure,
        "Zendesk API Error",
        `Failed to fetch dynamic content: ${response.status} - ${errorText}`,
      );
      throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as ZendeskDynamicContentSearchResponse;

    if (query) {
      return data.items.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.variants.some((variant) => variant.content.toLowerCase().includes(query.toLowerCase())),
      );
    }

    return data.items;
  } catch (error) {
    showToast(
      Toast.Style.Failure,
      "Connection Error",
      "Could not connect to Zendesk API. Please check your internet connection or API settings.",
    );
    throw error;
  }
}

export async function searchZendeskMacros(query: string): Promise<ZendeskMacro[]> {
  const url = `${getZendeskUrl()}/macros.json?active=true`;
  console.log("Zendesk Macro Search URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(),
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      showToast(Toast.Style.Failure, "Zendesk API Error", `Failed to fetch macros: ${response.status} - ${errorText}`);
      throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as ZendeskMacroSearchResponse;

    if (query) {
      return data.macros.filter(
        (macro) =>
          macro.title.toLowerCase().includes(query.toLowerCase()) ||
          (macro.description && macro.description.toLowerCase().includes(query.toLowerCase())),
      );
    }

    return data.macros;
  } catch (error) {
    showToast(
      Toast.Style.Failure,
      "Connection Error",
      "Could not connect to Zendesk API. Please check your internet connection or API settings.",
    );
    throw error;
  }
}
