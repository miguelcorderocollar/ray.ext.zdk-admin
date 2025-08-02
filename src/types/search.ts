// Shared types for the search architecture

export type SearchType =
  | "users"
  | "organizations"
  | "triggers"
  | "dynamic_content"
  | "macros"
  | "ticket_fields"
  | "support_addresses"
  | "ticket_forms"
  | "groups"
  | "tickets"
  | "views";

export const SEARCH_TYPE_LABELS: Record<SearchType, string> = {
  users: "Users",
  organizations: "Organizations",
  triggers: "Triggers",
  dynamic_content: "Dynamic Content",
  macros: "Macros",
  ticket_fields: "Ticket Fields",
  support_addresses: "Support Addresses",
  ticket_forms: "Ticket Forms",
  groups: "Groups",
  tickets: "Tickets",
  views: "Views",
};

export const SEARCH_TYPE_PLACEHOLDERS: Record<SearchType, string> = {
  users: "Search Zendesk users by name, email, etc.",
  organizations: "Search Zendesk organizations by name, domain, etc.",
  triggers: "Search Zendesk triggers by name",
  dynamic_content: "Search Zendesk dynamic content by name or content",
  macros: "Search Zendesk macros by name or description",
  ticket_fields: "Search ticket fields by title",
  support_addresses: "Search support addresses by name or email",
  ticket_forms: "Search ticket forms by name",
  groups: "Search groups by name",
  tickets: "Search tickets by subject, description, etc.",
  views: "Search views by title",
};

// Base interface for all search result components
export interface SearchResultsProps<T> {
  results: T[];
  isLoading: boolean;
  searchText: string;
  instance: import("../utils/preferences").ZendeskInstance | undefined;
  onInstanceChange: (instance: import("../utils/preferences").ZendeskInstance) => void;
  showDetails: boolean;
  onShowDetailsChange: (show: boolean) => void;
}

// Interface for search container state
export interface SearchContainerState {
  searchType: SearchType;
  searchText: string;
  currentInstance: import("../utils/preferences").ZendeskInstance | undefined;
  showDetails: boolean;
  isLoading: boolean;
}
