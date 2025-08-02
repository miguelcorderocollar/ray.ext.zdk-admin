import { List, ActionPanel, Action, Icon, Color, Keyboard } from "@raycast/api";
import { ZendeskTicketField, ZendeskInstance } from "../api/zendesk";
import { useState, useMemo } from "react";

interface TicketFieldOptionsListProps {
  ticketField: ZendeskTicketField;
  instance: ZendeskInstance | undefined;
}

export default function TicketFieldOptionsList({ ticketField, instance }: TicketFieldOptionsListProps) {
  const [searchText, setSearchText] = useState("");

  const filteredOptions = useMemo(() => {
    if (!ticketField.custom_field_options) {
      return [];
    }
    return ticketField.custom_field_options.filter((option) => {
      if (!option) return false;
      return (
        (option.name && option.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (option.value && option.value.toLowerCase().includes(searchText.toLowerCase())) ||
        false
      );
    });
  }, [ticketField.custom_field_options, searchText]);

  return (
    <List
      isLoading={!ticketField.custom_field_options}
      searchBarPlaceholder="Search options by name or value"
      onSearchTextChange={setSearchText}
      navigationTitle={`${ticketField.title || ""} Options`}
    >
      {filteredOptions.map((option) => (
        <List.Item
          key={option.id}
          title={option.name}
          accessories={[{ tag: option.value || "" }]}
          icon={option.default ? { source: Icon.Star, tintColor: Color.Yellow } : undefined}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser
                title="Open in Zendesk"
                url={`https://${instance?.subdomain}.zendesk.com/admin/objects-rules/tickets/ticket-fields/${ticketField.id}`}
                shortcut={Keyboard.Shortcut.Common.Open}
              />
              <Action.CopyToClipboard
                title="Copy Tag to Clipboard"
                content={option.value || ""}
                shortcut={{
                  macOS: { modifiers: ["cmd"], key: "t" },
                  windows: { modifiers: ["ctrl"], key: "t" },
                }}
              />
              <Action.CopyToClipboard
                title="Copy Name to Clipboard"
                content={option.name}
                shortcut={Keyboard.Shortcut.Common.CopyName}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
