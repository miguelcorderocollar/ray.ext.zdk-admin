import { List } from "@raycast/api";
import { SearchType, SEARCH_TYPE_LABELS } from "../../types/search";

interface SearchTypeSelectorProps {
  value: SearchType;
  onChange: (searchType: SearchType) => void;
}

export function SearchTypeSelector({ value, onChange }: SearchTypeSelectorProps) {
  return (
    <List.Dropdown onChange={(newValue) => onChange(newValue as SearchType)} tooltip="Select Search Type" value={value}>
      <List.Dropdown.Section title="Ticketing">
        <List.Dropdown.Item title={SEARCH_TYPE_LABELS.tickets} value="tickets" />
        <List.Dropdown.Item title={SEARCH_TYPE_LABELS.users} value="users" />
        <List.Dropdown.Item title={SEARCH_TYPE_LABELS.organizations} value="organizations" />
        <List.Dropdown.Item title={SEARCH_TYPE_LABELS.views} value="views" />
      </List.Dropdown.Section>
      <List.Dropdown.Section title="Admin">
        <List.Dropdown.Item title={SEARCH_TYPE_LABELS.groups} value="groups" />
        <List.Dropdown.Item title={SEARCH_TYPE_LABELS.triggers} value="triggers" />
        <List.Dropdown.Item title={SEARCH_TYPE_LABELS.dynamic_content} value="dynamic_content" />
        <List.Dropdown.Item title={SEARCH_TYPE_LABELS.macros} value="macros" />
        <List.Dropdown.Item title={SEARCH_TYPE_LABELS.ticket_fields} value="ticket_fields" />
        <List.Dropdown.Item title={SEARCH_TYPE_LABELS.support_addresses} value="support_addresses" />
        <List.Dropdown.Item title={SEARCH_TYPE_LABELS.ticket_forms} value="ticket_forms" />
      </List.Dropdown.Section>
    </List.Dropdown>
  );
}
