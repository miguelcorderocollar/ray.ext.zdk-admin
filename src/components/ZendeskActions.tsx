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
  ZendeskTicket,
  ZendeskView,
} from "../api/zendesk";
import EditUserForm from "./EditUserForm";
import AddTicketFieldOptionForm from "./AddTicketFieldOptionForm";
import TicketFieldOptionsList from "./TicketFieldOptionsList";
import CreateUserForm from "./CreateUserForm";
import EntityTicketsList from "./EntityTicketsList";

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
    | ZendeskGroup
    | ZendeskTicket
    | ZendeskView;
  searchType:
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
  instance: ZendeskInstance | undefined;
  onInstanceChange: (instance: ZendeskInstance) => void;
  showDetails?: boolean;
  onShowDetailsChange?: (show: boolean) => void;
  children?: React.ReactNode;
}

export function ZendeskActions({
  item,
  searchType,
  instance,
  onInstanceChange,
  showDetails,
  onShowDetailsChange,
}: ZendeskActionsProps) {
  const allInstances = getZendeskInstances();

  const renderViewTicketsAction = (
    entityType: "user" | "organization" | "group" | "recipient" | "form",
    entityId?: string,
    entityEmail?: string,
  ) => {
    return (
      <Action.Push
        title={`View ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}'s Tickets`}
        icon={Icon.Ticket}
        target={
          <EntityTicketsList
            entityType={entityType}
            entityId={entityId}
            entityEmail={entityEmail}
            instance={instance}
          />
        }
        shortcut={{ modifiers: ["cmd"], key: "t" }}
      />
    );
  };

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
            title="Open Ticket Field"
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
          <Action.OpenInBrowser
            title="Open Ticket Form Conditions"
            url={`https://${instance?.subdomain}.zendesk.com/admin/objects-rules/tickets/ticket-forms/edit/${ticketForm.id}/conditions`}
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
          {renderViewTicketsAction("group", group.id.toString())}
        </>
      );
    } else if (searchType === "tickets") {
      const ticket = item as ZendeskTicket;
      return (
        <>
          <Action.OpenInBrowser
            title="Open Ticket"
            url={`https://${instance?.subdomain}.zendesk.com/agent/tickets/${ticket.id}`}
          />
          <Action.CopyToClipboard
            title="Copy Link to Clipboard"
            content={`https://${instance?.subdomain}.zendesk.com/agent/tickets/${ticket.id}`}
          />
        </>
      );
    } else if (searchType === "views") {
      const view = item as ZendeskView;
      return (
        <>
          <Action.OpenInBrowser
            title="Open Agent View"
            url={`https://${instance?.subdomain}.zendesk.com/agent/filters/${view.id}`}
          />
          <Action.OpenInBrowser
            title="Open Admin Edit View"
            url={`https://${instance?.subdomain}.zendesk.com/admin/workspaces/agent-workspace/views/${view.id}`}
          />
          <Action.OpenInBrowser
            title="Open Admin Views Page"
            url={`https://${instance?.subdomain}.zendesk.com/admin/workspaces/agent-workspace/views`}
          />
          <Action.CopyToClipboard
            title="Copy Agent View Link"
            content={`https://${instance?.subdomain}.zendesk.com/agent/views/${view.id}`}
          />
        </>
      );
    }
    return null;
  };

  const renderEntityActions = () => {
    if (searchType === "users") {
      const user = item as ZendeskUser;
      return (
        <>
          <Action.Push title="Edit User" icon={Icon.Pencil} target={<EditUserForm user={user} instance={instance} />} />
          <Action.Push title="Create User" icon={Icon.Plus} target={<CreateUserForm instance={instance} />} />
          {user.email && renderViewTicketsAction("user", undefined, user.email)}
        </>
      );
    } else if (searchType === "ticket_fields") {
      const ticketField = item as ZendeskTicketField;
      if (ticketField.type === "multiselect" || ticketField.type === "tagger") {
        return (
          <>
            <Action.Push
              title="Add New Option"
              icon={Icon.Plus}
              target={<AddTicketFieldOptionForm ticketField={ticketField} instance={instance} />}
            />
            <Action.Push
              title="View Options"
              icon={Icon.List}
              target={<TicketFieldOptionsList ticketField={ticketField} instance={instance} />}
            />
          </>
        );
      }
      return null;
    } else if (searchType === "organizations") {
      const organization = item as ZendeskOrganization;
      return <>{renderViewTicketsAction("organization", organization.id.toString())}</>;
    } else if (searchType === "support_addresses") {
      const supportAddress = item as ZendeskSupportAddress;
      return <>{renderViewTicketsAction("recipient", undefined, supportAddress.email)}</>;
    } else if (searchType === "ticket_forms") {
      const ticketForm = item as ZendeskTicketForm;
      return <>{renderViewTicketsAction("form", ticketForm.id.toString())}</>;
    } else if (searchType === "groups") {
      const group = item as ZendeskGroup;
      return <>{renderViewTicketsAction("group", group.id.toString())}</>;
    }
    return null;
  };

  const renderGeneralActions = () => {
    let generalConfigUrl = `https://${instance?.subdomain}.zendesk.com`;
    let shortcutKey: Keyboard.KeyEquivalent | undefined = undefined;

    const actions = [];

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
    } else if (searchType === "tickets") {
      generalConfigUrl = `${generalConfigUrl}/agent/filters`;
      shortcutKey = "t";
    } else if (searchType === "views") {
      generalConfigUrl = `${generalConfigUrl}/admin/objects-rules/rules/views`;
      shortcutKey = "v";
    }

    actions.push(
      <Action.OpenInBrowser
        key="general-config"
        title="Open General Configuration"
        url={generalConfigUrl}
        shortcut={shortcutKey ? { modifiers: ["cmd", "shift"], key: shortcutKey } : undefined}
      />,
    );

    // Add show/hide details toggle if the props are provided
    if (showDetails !== undefined && onShowDetailsChange) {
      actions.push(
        <Action
          key="toggle-details"
          title={showDetails ? "Hide Details" : "Show Details"}
          icon={showDetails ? Icon.EyeDisabled : Icon.Eye}
          onAction={() => onShowDetailsChange(!showDetails)}
          shortcut={{ modifiers: ["cmd"], key: "d" }}
        />,
      );
    }

    actions.push(
      <ActionPanel.Submenu key="change-instance" title="Change Instance" icon={Icon.House}>
        {allInstances.map((inst) => (
          <Action
            key={inst.subdomain}
            title={`${inst.subdomain}`}
            icon={instance?.subdomain === inst.subdomain ? { source: Icon.Dot, tintColor: Color.Green } : undefined}
            onAction={() => onInstanceChange(inst)}
          />
        ))}
      </ActionPanel.Submenu>,
    );

    return <>{actions}</>;
  };

  return (
    <ActionPanel>
      <ActionPanel.Section title="Open">{renderOpenActions()}</ActionPanel.Section>
      {renderEntityActions() && (
        <ActionPanel.Section title="Entity Actions">{renderEntityActions()}</ActionPanel.Section>
      )}
      <ActionPanel.Section title="General">{renderGeneralActions()}</ActionPanel.Section>
    </ActionPanel>
  );
}
