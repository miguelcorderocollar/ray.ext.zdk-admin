import { ActionPanel, Action, Icon, Keyboard, Color } from "@raycast/api";
import { getZendeskInstances, ZendeskInstance } from "../utils/preferences";
import {
  ZendeskUser,
  ZendeskOrganization,
  ZendeskTrigger,
  ZendeskDynamicContent,
  ZendeskMacro,
  ZendeskTicketField,
  ZendeskSupportAddress,
  ZendeskTicketForm,
  ZendeskGroup,
} from "../api/zendesk";
import EditUserForm from "./EditUserForm";

interface ZendeskActionsProps {
  item:
    | ZendeskUser
    | ZendeskOrganization
    | ZendeskTrigger
    | ZendeskDynamicContent
    | ZendeskMacro
    | ZendeskTicketField
    | ZendeskSupportAddress
    | ZendeskTicketForm
    | ZendeskGroup;
  searchType:
    | "users"
    | "organizations"
    | "triggers"
    | "dynamic_content"
    | "macros"
    | "ticket_fields"
    | "support_addresses"
    | "ticket_forms"
    | "groups";
  instance: ZendeskInstance | undefined;
  onInstanceChange: (instance: ZendeskInstance) => void;
}

export function ZendeskActions({ item, searchType, instance, onInstanceChange }: ZendeskActionsProps) {
  const allInstances = getZendeskInstances();

  const renderOpenActions = () => {
    if (searchType === "users") {
      const user = item as ZendeskUser;
      return (
        <>
          <Action.OpenInBrowser
            title="Open in Browser"
            url={`https://${instance?.subdomain}.zendesk.com/agent/users/${user.id}`}
          />
          <Action.CopyToClipboard
            title="Copy Link"
            content={`https://${instance?.subdomain}.zendesk.com/agent/users/${user.id}`}
          />
        </>
      );
    } else if (searchType === "organizations") {
      const organization = item as ZendeskOrganization;
      return (
        <>
          <Action.OpenInBrowser
            title="Open in Browser"
            url={`https://${instance?.subdomain}.zendesk.com/agent/organizations/${organization.id}`}
          />
          <Action.CopyToClipboard
            title="Copy Link"
            content={`https://${instance?.subdomain}.zendesk.com/agent/organizations/${organization.id}`}
          />
        </>
      );
    } else if (searchType === "dynamic_content") {
      const dynamicContent = item as ZendeskDynamicContent;
      const defaultVariant = dynamicContent.variants?.find((v) => v.id === dynamicContent.default_locale_id);
      return (
        <>
          <Action.OpenInBrowser
            title="Open Dynamic Content"
            url={`https://${instance?.subdomain}.zendesk.com/dynamic_content/items/${dynamicContent.id}`}
          />
          <Action.CopyToClipboard
            title="Copy Link to Clipboard"
            content={`https://${instance?.subdomain}.zendesk.com/dynamic_content/items/${dynamicContent.id}`}
          />
          {defaultVariant && (
            <Action.CopyToClipboard title="Copy Content to Clipboard" content={defaultVariant.content} />
          )}
        </>
      );
    } else if (searchType === "macros") {
      const macro = item as ZendeskMacro;
      return (
        <>
          <Action.OpenInBrowser
            title="Open Macro in Zendesk"
            url={`https://${instance?.subdomain}.zendesk.com/admin/workspaces/agent-workspace/macros/${macro.id}`}
          />
          <Action.CopyToClipboard
            title="Copy Macro Link"
            content={`https://${instance?.subdomain}.zendesk.com/admin/workspaces/agent-workspace/macros/${macro.id}`}
          />
        </>
      );
    } else if (searchType === "triggers") {
      const trigger = item as ZendeskTrigger;
      return (
        <>
          <Action.OpenInBrowser
            title="Open in Browser"
            url={`https://${instance?.subdomain}.zendesk.com/admin/objects-rules/rules/triggers/${trigger.id}`}
          />
          <Action.CopyToClipboard
            title="Copy URL to Clipboard"
            content={`https://${instance?.subdomain}.zendesk.com/admin/objects-rules/rules/triggers/${trigger.id}`}
          />
        </>
      );
    } else if (searchType === "ticket_fields") {
      const ticketField = item as ZendeskTicketField;
      return (
        <>
          <Action.OpenInBrowser
            title="Open Ticket Fields"
            url={`https://${instance?.subdomain}.zendesk.com/admin/objects-rules/tickets/ticket-fields/${ticketField.id}`}
          />
          <Action.CopyToClipboard
            title="Copy Link to Clipboard"
            content={`https://${instance?.subdomain}.zendesk.com/admin/objects-rules/tickets/ticket-fields/${ticketField.id}`}
          />
        </>
      );
    } else if (searchType === "support_addresses") {
      const supportAddress = item as ZendeskSupportAddress;
      return (
        <>
          <Action.CopyToClipboard title="Copy Email to Clipboard" content={supportAddress.email} />
        </>
      );
    } else if (searchType === "ticket_forms") {
      const ticketForm = item as ZendeskTicketForm;
      return (
        <>
          <Action.OpenInBrowser
            title="Open Ticket Form"
            url={`https://${instance?.subdomain}.zendesk.com/admin/objects-rules/tickets/ticket-forms/edit/${ticketForm.id}`}
          />
          <Action.CopyToClipboard
            title="Copy Link to Clipboard"
            content={`https://${instance?.subdomain}.zendesk.com/admin/objects-rules/tickets/ticket-forms/edit/${ticketForm.id}`}
          />
        </>
      );
    } else if (searchType === "groups") {
      const group = item as ZendeskGroup;
      return (
        <>
          <Action.OpenInBrowser
            title="Open Group Details"
            url={`https://${instance?.subdomain}.zendesk.com/admin/people/groups/${group.id}`}
          />
          <Action.CopyToClipboard
            title="Copy Link to Clipboard"
            content={`https://${instance?.subdomain}.zendesk.com/admin/people/groups/${group.id}`}
          />
        </>
      );
    }
    return null;
  };

  const renderEditActions = () => {
    if (searchType === "users") {
      const user = item as ZendeskUser;
      return (
        <Action.Push title="Edit User" icon={Icon.Pencil} target={<EditUserForm user={user} instance={instance} />} />
      );
    }
    return null;
  };

  const renderGeneralActions = () => {
    let generalConfigUrl = `https://${instance?.subdomain}.zendesk.com`;
    let shortcutKey: Keyboard.KeyEquivalent | undefined = undefined;

    if (searchType === "users") {
      generalConfigUrl = `${generalConfigUrl}/agent/user_filters`;
      shortcutKey = "u";
    } else if (searchType === "organizations") {
      generalConfigUrl = `${generalConfigUrl}/agent/organizations`;
      shortcutKey = "o";
    } else if (searchType === "dynamic_content") {
      generalConfigUrl = `${generalConfigUrl}/admin/workspaces/agent-workspace/dynamic_content`;
      shortcutKey = "d";
    } else if (searchType === "macros") {
      generalConfigUrl = `${generalConfigUrl}/admin/workspaces/agent-workspace/macros`;
      shortcutKey = "m";
    } else if (searchType === "triggers") {
      generalConfigUrl = `${generalConfigUrl}/admin/objects-rules/rules/triggers`;
      shortcutKey = "t";
    } else if (searchType === "ticket_fields") {
      generalConfigUrl = `${generalConfigUrl}/admin/objects-rules/tickets/ticket-fields`;
      shortcutKey = "f";
    } else if (searchType === "support_addresses") {
      generalConfigUrl = `${generalConfigUrl}/admin/channels/talk_and_email/email`;
      shortcutKey = "s";
    } else if (searchType === "ticket_forms") {
      generalConfigUrl = `${generalConfigUrl}/admin/objects-rules/tickets/ticket-forms`;
      shortcutKey = "f";
    } else if (searchType === "groups") {
      generalConfigUrl = `${generalConfigUrl}/admin/people/groups`;
      shortcutKey = "g";
    }

    return (
      <>
        <Action.OpenInBrowser
          title="Open General Configuration"
          url={generalConfigUrl}
          shortcut={shortcutKey ? { modifiers: ["cmd", "shift"], key: shortcutKey } : undefined}
        />
        <ActionPanel.Submenu title="Change Instance" icon={Icon.House}>
          {allInstances.map((inst) => (
            <Action
              key={inst.subdomain}
              title={`${inst.subdomain}`}
              icon={instance?.subdomain === inst.subdomain ? { source: Icon.Dot, tintColor: Color.Green } : undefined}
              onAction={() => onInstanceChange(inst)}
            />
          ))}
        </ActionPanel.Submenu>
      </>
    );
  };

  return (
    <ActionPanel>
      <ActionPanel.Section title="Open">{renderOpenActions()}</ActionPanel.Section>
      {renderEditActions() && <ActionPanel.Section title="Edit">{renderEditActions()}</ActionPanel.Section>}
      <ActionPanel.Section title="General">{renderGeneralActions()}</ActionPanel.Section>
    </ActionPanel>
  );
}
