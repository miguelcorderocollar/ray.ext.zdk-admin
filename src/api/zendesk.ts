import { showToast, Toast } from "@raycast/api";
import { ZendeskInstance } from "../utils/preferences";

export type { ZendeskInstance };

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

interface ZendeskDynamicContentListResponse {
  items: ZendeskDynamicContent[];
  next_page: string | null;
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

interface ZendeskMacroListResponse {
  macros: ZendeskMacro[];
}

export interface ZendeskTicketField {
  id: number;
  url: string;
  type: string;
  title: string;
  raw_title: string;
  description: string;
  raw_description: string;
  position: number;
  active: boolean;
  required: boolean;
  collapsed_for_agents: boolean;
  regexp_for_validation: string | null;
  title_in_portal: string;
  raw_title_in_portal: string;
  visible_in_portal: boolean;
  editable_in_portal: boolean;
  required_in_portal: boolean;
  tag: string | null;
  created_at: string;
  updated_at: string;
  removable: boolean;
  agent_description: string | null;
  system_field_options: unknown[];
  custom_field_options?: ZendeskCustomFieldOption[];
  sub_type_id: number | null;
  permission_group_id: number | null;
}

export interface ZendeskCustomFieldOption {
  id: number;
  name: string;
  value: string | null;
  default: boolean;
}

interface ZendeskTicketFieldSearchResponse {
  ticket_fields: ZendeskTicketField[];
}

export interface ZendeskSupportAddress {
  id: number;
  url: string;
  email: string;
  name: string;
  default: boolean;
  brand_id: number;
  cname_status: string;
  dns_results: string;
  domain_verification_code: string;
  domain_verification_status: string;
  forwarding_status: string;
  spf_status: string;
  created_at: string;
  updated_at: string;
}

interface ZendeskSupportAddressSearchResponse {
  recipient_addresses: ZendeskSupportAddress[];
  next_page: string | null;
}

export interface ZendeskTicketForm {
  id: number;
  name: string;
  display_name: string;
  position: number;
  active: boolean;
  end_user_visible: boolean;
  default: boolean;
  in_all_brands: boolean;
  restricted_brand_ids: number[];
  created_at: string;
  updated_at: string;
}

interface ZendeskTicketFormSearchResponse {
  ticket_forms: ZendeskTicketForm[];
}

export interface ZendeskGroup {
  id: number;
  name: string;
  description: string;
  default: boolean;
  deleted: boolean;
  created_at: string;
  updated_at: string;
  url: string;
  is_public: boolean;
}

interface ZendeskGroupSearchResponse {
  groups: ZendeskGroup[];
  next_page: string | null;
}

export interface ZendeskTicket {
  id: number;
  subject: string;
  description: string;
  status: string;
  organization_id: number;
  brand_id: number;
  group_id: number;
  created_at: string;
  updated_at: string;
  external_id: string;
  recipient: string;
  tags: string[];
  ticket_form_id: number;
  priority: string;
  type: string;
  via: { channel: string; source: { from: Record<string, unknown>; to: Record<string, unknown> }; rel: string };
  custom_fields: { id: number; value: string | null }[];
}

interface ZendeskTicketSearchResponse {
  results: ZendeskTicket[];
  count: number;
}

export interface ZendeskView {
  id: number;
  title: string;
  active: boolean;
  updated_at: string;
  created_at: string;
}

interface ZendeskViewSearchResponse {
  views: ZendeskView[];
  count: number;
}

export interface ZendeskGroupMembership {
  id: number;
  user_id: number;
  group_id: number;
  default: boolean;
  created_at: string;
  updated_at: string;
}

interface ZendeskGroupMembershipResponse {
  group_memberships: ZendeskGroupMembership[];
}

export function getZendeskAuthHeader(instance: ZendeskInstance): string {
  const credentials = `${instance.user}/token:${instance.api_key}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}

export function getZendeskUrl(instance: ZendeskInstance): string {
  return `https://${instance.subdomain}.zendesk.com/api/v2`;
}

export async function searchZendeskUsers(query: string, instance: ZendeskInstance): Promise<ZendeskUser[]> {
  const searchTerms = query;
  const url = `${getZendeskUrl(instance)}/users/search.json?query=${encodeURIComponent(searchTerms)}&per_page=20`;
  console.log("Zendesk User Search URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
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

export async function searchZendeskOrganizations(
  query: string,
  instance: ZendeskInstance,
): Promise<ZendeskOrganization[]> {
  const searchTerms = query;
  const url = `${getZendeskUrl(instance)}/search.json?query=type:organization ${encodeURIComponent(searchTerms)}&per_page=20`;
  console.log("Zendesk Organization Search URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
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

export async function searchZendeskTriggers(query: string, instance: ZendeskInstance): Promise<ZendeskTrigger[]> {
  const searchTerms = query;
  const url = searchTerms
    ? `${getZendeskUrl(instance)}/triggers/search.json?query=${encodeURIComponent(searchTerms)}`
    : `${getZendeskUrl(instance)}/triggers.json`;
  console.log("Zendesk Trigger Search URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
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

export async function updateUser(
  userId: number,
  updatedFields: Record<string, unknown>,
  instance: ZendeskInstance,
): Promise<ZendeskUser> {
  const url = `${getZendeskUrl(instance)}/users/${userId}.json`;
  console.log("Zendesk Update User URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
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

export async function searchZendeskDynamicContent(
  query: string,
  instance: ZendeskInstance,
  onPage: (items: ZendeskDynamicContent[]) => void,
): Promise<void> {
  let url: string | null = `${getZendeskUrl(instance)}/dynamic_content/items.json`;
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
    "Content-Type": "application/json",
  };

  try {
    while (url) {
      console.log("Zendesk Dynamic Content Search URL:", url);
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

      const data = (await response.json()) as ZendeskDynamicContentListResponse;
      onPage(data.items);
      url = data.next_page;
    }
  } catch (error) {
    showToast(
      Toast.Style.Failure,
      "Connection Error",
      "Could not connect to Zendesk API. Please check your internet connection or API settings.",
    );
    throw error;
  }
}

export async function searchZendeskMacros(query: string, instance: ZendeskInstance): Promise<ZendeskMacro[]> {
  const url = query
    ? `${getZendeskUrl(instance)}/macros/search.json?query=${encodeURIComponent(query)}`
    : `${getZendeskUrl(instance)}/macros.json?per_page=30`;
  console.log("Zendesk Macro Search URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
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

    const data = (await response.json()) as ZendeskMacroListResponse;
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

export async function searchZendeskTicketFields(
  query: string,
  instance: ZendeskInstance,
): Promise<ZendeskTicketField[]> {
  const url = `${getZendeskUrl(instance)}/ticket_fields.json`;
  console.log("Zendesk Ticket Fields Search URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
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
        `Failed to fetch ticket fields: ${response.status} - ${errorText}`,
      );
      throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as ZendeskTicketFieldSearchResponse;

    if (query) {
      return data.ticket_fields.filter((field) => field.title.toLowerCase().includes(query.toLowerCase()));
    }

    return data.ticket_fields;
  } catch (error) {
    showToast(
      Toast.Style.Failure,
      "Connection Error",
      "Could not connect to Zendesk API. Please check your internet connection or API settings.",
    );
    throw error;
  }
}

export async function searchZendeskSupportAddresses(
  instance: ZendeskInstance,
  onPage: (addresses: ZendeskSupportAddress[]) => void,
): Promise<void> {
  let url: string | null = `${getZendeskUrl(instance)}/recipient_addresses.json`;
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
    "Content-Type": "application/json",
  };

  try {
    while (url) {
      console.log("Zendesk Support Addresses Search URL:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        showToast(
          Toast.Style.Failure,
          "Zendesk API Error",
          `Failed to fetch support addresses: ${response.status} - ${errorText}`,
        );
        throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as ZendeskSupportAddressSearchResponse;
      onPage(data.recipient_addresses);
      url = data.next_page;
    }
  } catch (error) {
    showToast(
      Toast.Style.Failure,
      "Connection Error",
      "Could not connect to Zendesk API. Please check your internet connection or API settings.",
    );
    throw error;
  }
}

export async function searchZendeskTicketForms(query: string, instance: ZendeskInstance): Promise<ZendeskTicketForm[]> {
  const url = `${getZendeskUrl(instance)}/ticket_forms.json`;
  console.log("Zendesk Ticket Forms Search URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
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
        `Failed to fetch ticket forms: ${response.status} - ${errorText}`,
      );
      throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as ZendeskTicketFormSearchResponse;

    if (query) {
      return data.ticket_forms.filter((form) => form.name.toLowerCase().includes(query.toLowerCase()));
    }

    return data.ticket_forms;
  } catch (error) {
    showToast(
      Toast.Style.Failure,
      "Connection Error",
      "Could not connect to Zendesk API. Please check your internet connection or API settings.",
    );
    throw error;
  }
}

export async function searchZendeskGroups(instance: ZendeskInstance): Promise<ZendeskGroup[]> {
  let allGroups: ZendeskGroup[] = [];
  let url: string | null = `${getZendeskUrl(instance)}/groups.json?per_page=100`;
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
    "Content-Type": "application/json",
  };

  try {
    while (url) {
      console.log("Zendesk Groups Search URL:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        showToast(
          Toast.Style.Failure,
          "Zendesk API Error",
          `Failed to fetch groups: ${response.status} - ${errorText}`,
        );
        throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as ZendeskGroupSearchResponse;
      allGroups = allGroups.concat(data.groups);
      url = data.next_page;
    }
    return allGroups;
  } catch (error) {
    showToast(
      Toast.Style.Failure,
      "Connection Error",
      "Could not connect to Zendesk API. Please check your internet connection or API settings.",
    );
    throw error;
  }
}

export async function addTicketFieldOption(
  ticketFieldId: number,
  label: string,
  tag: string,
  instance: ZendeskInstance,
): Promise<void> {
  const url = `${getZendeskUrl(instance)}/ticket_fields/${ticketFieldId}/options.json`;
  console.log("Zendesk Add Ticket Field Option URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ custom_field_option: { name: label, value: tag } }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      showToast(
        Toast.Style.Failure,
        "Zendesk API Error",
        `Failed to add ticket field option: ${response.status} - ${errorText}`,
      );
      throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    showToast(
      Toast.Style.Failure,
      "Connection Error",
      "Could not connect to Zendesk API. Please check your internet connection or API settings.",
    );
    throw error;
  }
}

export async function createUser(name: string, email: string, instance: ZendeskInstance): Promise<ZendeskUser> {
  const url = `${getZendeskUrl(instance)}/users.json`;
  console.log("Zendesk Create User URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ user: { name, email, verified: true, skip_verify_email: true } }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to create user: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (
          errorJson.details &&
          errorJson.details.email &&
          errorJson.details.email[0] &&
          errorJson.details.email[0].error === "DuplicateValue"
        ) {
          errorMessage = errorJson.details.email[0].description || `Failed to create user: Email already exists.`;
        } else if (errorJson.description) {
          errorMessage = `Failed to create user: ${errorJson.description}`;
        } else if (errorJson.error) {
          errorMessage = `Failed to create user: ${errorJson.error}`;
        } else {
          errorMessage = `Failed to create user: An unexpected error occurred.`;
        }
      } catch (parseError) {
        console.error("Failed to parse error response as JSON:", parseError);
        errorMessage = `Failed to create user: An unexpected error occurred. Please check logs for details.`;
      }
      showToast(Toast.Style.Failure, "Zendesk API Error", errorMessage);
      throw new Error(`Zendesk API Error: ${errorMessage}`);
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

export async function searchZendeskTickets(
  query: string,
  instance: ZendeskInstance,
  filters?: {
    userEmail?: string;
    groupId?: string;
    organizationId?: string;
    brandId?: string;
    formId?: string;
    recipient?: string;
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
  const url = `${getZendeskUrl(instance)}/search.json?query=${encodeURIComponent(searchTerms)}&per_page=30`;
  console.log("Zendesk Ticket Search URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      showToast(Toast.Style.Failure, "Zendesk API Error", `Failed to fetch tickets: ${response.status} - ${errorText}`);
      throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as ZendeskTicketSearchResponse;
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

export async function searchZendeskViews(query: string, instance: ZendeskInstance): Promise<ZendeskView[]> {
  const url = `${getZendeskUrl(instance)}/views.json?active=true`;
  console.log("Zendesk Views Search URL:", url);
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      showToast(Toast.Style.Failure, "Zendesk API Error", `Failed to fetch views: ${response.status} - ${errorText}`);
      throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as ZendeskViewSearchResponse;

    if (query) {
      return data.views.filter((view) => view.title.toLowerCase().includes(query.toLowerCase()));
    }

    return data.views;
  } catch (error) {
    showToast(
      Toast.Style.Failure,
      "Connection Error",
      "Could not connect to Zendesk API. Please check your internet connection or API settings.",
    );
    throw error;
  }
}

export async function searchZendeskGroupMemberships(
  groupId: number,
  instance: ZendeskInstance,
  onPage: (memberships: ZendeskGroupMembership[]) => void,
): Promise<void> {
  let url: string | null = `${getZendeskUrl(instance)}/groups/${groupId}/memberships.json`;
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
    "Content-Type": "application/json",
  };

  try {
    while (url) {
      console.log("Zendesk Group Memberships Search URL:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        showToast(
          Toast.Style.Failure,
          "Zendesk API Error",
          `Failed to fetch group memberships: ${response.status} - ${errorText}`,
        );
        throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as ZendeskGroupMembershipResponse;
      onPage(data.group_memberships);
      url = null; // No next page for this endpoint
    }
  } catch (error) {
    showToast(
      Toast.Style.Failure,
      "Connection Error",
      "Could not connect to Zendesk API. Please check your internet connection or API settings.",
    );
    throw error;
  }
}

export async function searchZendeskUserGroupMemberships(
  userId: number,
  instance: ZendeskInstance,
  onPage: (memberships: ZendeskGroupMembership[]) => void,
): Promise<void> {
  let url: string | null = `${getZendeskUrl(instance)}/users/${userId}/group_memberships.json`;
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
    "Content-Type": "application/json",
  };

  try {
    while (url) {
      console.log("Zendesk User Group Memberships Search URL:", url);
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        showToast(
          Toast.Style.Failure,
          "Zendesk API Error",
          `Failed to fetch user group memberships: ${response.status} - ${errorText}`,
        );
        throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as ZendeskGroupMembershipResponse;
      onPage(data.group_memberships);
      url = null; // No next page for this endpoint
    }
  } catch (error) {
    showToast(
      Toast.Style.Failure,
      "Connection Error",
      "Could not connect to Zendesk API. Please check your internet connection or API settings.",
    );
    throw error;
  }
}

export async function getGroupUsers(groupId: number, instance: ZendeskInstance): Promise<ZendeskUser[]> {
  const url = `${getZendeskUrl(instance)}/groups/${groupId}/users.json`;
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
    "Content-Type": "application/json",
  };

  try {
    console.log("Zendesk Group Users URL:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      showToast(
        Toast.Style.Failure,
        "Zendesk API Error",
        `Failed to fetch group users: ${response.status} - ${errorText}`,
      );
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

export async function getUserGroups(userId: number, instance: ZendeskInstance): Promise<ZendeskGroup[]> {
  const url = `${getZendeskUrl(instance)}/users/${userId}/groups.json`;
  const headers = {
    Authorization: getZendeskAuthHeader(instance),
    "Content-Type": "application/json",
  };

  try {
    console.log("Zendesk User Groups URL:", url);
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      showToast(
        Toast.Style.Failure,
        "Zendesk API Error",
        `Failed to fetch user groups: ${response.status} - ${errorText}`,
      );
      throw new Error(`Zendesk API Error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as ZendeskGroupSearchResponse;
    return data.groups;
  } catch (error) {
    showToast(
      Toast.Style.Failure,
      "Connection Error",
      "Could not connect to Zendesk API. Please check your internet connection or API settings.",
    );
    throw error;
  }
}
