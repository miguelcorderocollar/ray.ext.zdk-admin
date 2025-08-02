import { List } from "@raycast/api";

export type SearchType =
  | "users"
  | "organizations"
  | "dynamic_content"
  | "macros"
  | "ticket_fields"
  | "support_addresses"
  | "ticket_forms"
  | "groups"
  | "tickets"
  | "views"
  | "triggers"
  | "brands";

interface SearchTypeSelectorProps {
  value: SearchType;
  onChange: (value: SearchType) => void;
}

const searchTypeOptions = [
  { value: "users", title: "Users" },
  { value: "organizations", title: "Organizations" },
  { value: "dynamic_content", title: "Dynamic Content" },
  { value: "macros", title: "Macros" },
  { value: "ticket_fields", title: "Ticket Fields" },
  { value: "support_addresses", title: "Support Addresses" },
  { value: "ticket_forms", title: "Ticket Forms" },
  { value: "groups", title: "Groups" },
  { value: "tickets", title: "Tickets" },
  { value: "views", title: "Views" },
  { value: "triggers", title: "Triggers" },
  { value: "brands", title: "Brands" },
] as const;

/**
 * Reusable search type selector dropdown
 */
export function SearchTypeSelector({ value, onChange }: SearchTypeSelectorProps) {
  return (
    <List.Dropdown
      value={value}
      onChange={(newValue) => onChange(newValue as SearchType)}
      placeholder="Select search type"
      tooltip="Select Search Type"
    >
      <List.Dropdown.Section title="Ticketing">
        <List.Dropdown.Item title="Tickets" value="tickets" />
        <List.Dropdown.Item title="Users" value="users" />
        <List.Dropdown.Item title="Organizations" value="organizations" />
        <List.Dropdown.Item title="Views" value="views" />
        <List.Dropdown.Item title="Brands" value="brands" />
      </List.Dropdown.Section>
      <List.Dropdown.Section title="Admin">
        <List.Dropdown.Item title="Groups" value="groups" />
        <List.Dropdown.Item title="Triggers" value="triggers" />
        <List.Dropdown.Item title="Dynamic Content" value="dynamic_content" />
        <List.Dropdown.Item title="Macros" value="macros" />
        <List.Dropdown.Item title="Ticket Fields" value="ticket_fields" />
        <List.Dropdown.Item title="Support Addresses" value="support_addresses" />
        <List.Dropdown.Item title="Ticket Forms" value="ticket_forms" />
      </List.Dropdown.Section>
    </List.Dropdown>
  );
}

/**
 * Get the display name for a search type
 */
export function getSearchTypeDisplayName(searchType: SearchType): string {
  const option = searchTypeOptions.find((opt) => opt.value === searchType);
  return option?.title || searchType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Get the placeholder text for a search type
 */
export function getSearchTypePlaceholder(searchType: SearchType): string {
  const displayName = getSearchTypeDisplayName(searchType);
  return `Start typing to search ${displayName.toLowerCase()}...`;
}
