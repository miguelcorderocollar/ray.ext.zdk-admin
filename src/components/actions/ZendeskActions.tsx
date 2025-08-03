import { ActionPanel, Action, Icon, Keyboard, Color } from "@raycast/api";
import { getZendeskInstances, ZendeskInstance } from "../../utils/preferences";
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
  ZendeskGroupMembership,
  ZendeskBrand,
  ZendeskAutomation,
  ZendeskCustomRole,
} from "../../api/zendesk";
import EditUserForm from "../forms/EditUserForm";
import AddTicketFieldOptionForm from "../forms/AddTicketFieldOptionForm";
import TicketFieldOptionsList from "../lists/TicketFieldOptionsList";
import CreateUserForm from "../forms/CreateUserForm";
import EntityTicketsList from "../lists/EntityTicketsList";
import GroupMembershipsList from "../lists/GroupMembershipsList";
import UserGroupMembershipsList from "../lists/UserGroupMembershipsList";

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
    | ZendeskView
    | ZendeskGroupMembership
    | ZendeskBrand
    | ZendeskAutomation
    | ZendeskCustomRole;
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
    | "views"
    | "group_memberships"
    | "brands"
    | "automations"
    | "custom_roles";
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
    entityType: "user" | "organization" | "group" | "recipient" | "form" | "brand" | "role",
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
        shortcut={{
          macOS: { modifiers: ["cmd"], key: "t" },
          windows: { modifiers: ["ctrl"], key: "t" },
        }}
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
            shortcut={Keyboard.Shortcut.Common.Open}
          />
          <Action.CopyToClipboard
            title="Copy Link"
            content={`https://${instance?.subdomain}.zendesk.com/agent/users/${user.id}`}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "l" },
              windows: { modifiers: ["ctrl"], key: "l" },
            }}
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
            shortcut={Keyboard.Shortcut.Common.Open}
          />
          <Action.CopyToClipboard
            title="Copy Link"
            content={`https://${instance?.subdomain}.zendesk.com/agent/organizations/${organization.id}`}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "l" },
              windows: { modifiers: ["ctrl"], key: "l" },
            }}
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
            shortcut={Keyboard.Shortcut.Common.Open}
          />
          <Action.CopyToClipboard
            title="Copy Link to Clipboard"
            content={`https://${instance?.subdomain}.zendesk.com/dynamic_content/items/${dynamicContent.id}`}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "l" },
              windows: { modifiers: ["ctrl"], key: "l" },
            }}
          />
          {defaultVariant && (
            <Action.CopyToClipboard
              title="Copy Content to Clipboard"
              content={defaultVariant.content}
              shortcut={Keyboard.Shortcut.Common.Copy}
            />
          )}
          <Action.CopyToClipboard
            title="Copy Placeholder to Clipboard"
            content={dynamicContent.placeholder}
            shortcut={{
              macOS: { modifiers: ["cmd", "shift"], key: "p" },
              windows: { modifiers: ["ctrl", "shift"], key: "p" },
            }}
          />
        </>
      );
    } else if (searchType === "macros") {
      const macro = item as ZendeskMacro;
      return (
        <>
          <Action.OpenInBrowser
            title="Open Macro in Zendesk"
            url={`https://${instance?.subdomain}.zendesk.com/admin/workspaces/agent-workspace/macros/${macro.id}`}
            shortcut={Keyboard.Shortcut.Common.Open}
          />
          <Action.CopyToClipboard
            title="Copy Macro Link"
            content={`https://${instance?.subdomain}.zendesk.com/admin/workspaces/agent-workspace/macros/${macro.id}`}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "l" },
              windows: { modifiers: ["ctrl"], key: "l" },
            }}
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
            shortcut={Keyboard.Shortcut.Common.Open}
          />
          <Action.CopyToClipboard
            title="Copy URL to Clipboard"
            content={`https://${instance?.subdomain}.zendesk.com/admin/objects-rules/rules/triggers/${trigger.id}`}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "l" },
              windows: { modifiers: ["ctrl"], key: "l" },
            }}
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
            shortcut={Keyboard.Shortcut.Common.Open}
          />
          <Action.CopyToClipboard
            title="Copy Link to Clipboard"
            content={`https://${instance?.subdomain}.zendesk.com/admin/objects-rules/tickets/ticket-fields/${ticketField.id}`}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "l" },
              windows: { modifiers: ["ctrl"], key: "l" },
            }}
          />
        </>
      );
    } else if (searchType === "support_addresses") {
      const supportAddress = item as ZendeskSupportAddress;
      return (
        <>
          <Action.CopyToClipboard
            title="Copy Email to Clipboard"
            content={supportAddress.email}
            shortcut={Keyboard.Shortcut.Common.Copy}
          />
        </>
      );
    } else if (searchType === "ticket_forms") {
      const ticketForm = item as ZendeskTicketForm;
      return (
        <>
          <Action.OpenInBrowser
            title="Open Ticket Form"
            url={`https://${instance?.subdomain}.zendesk.com/admin/objects-rules/tickets/ticket-forms/edit/${ticketForm.id}`}
            shortcut={Keyboard.Shortcut.Common.Open}
          />
          <Action.CopyToClipboard
            title="Copy Link to Clipboard"
            content={`https://${instance?.subdomain}.zendesk.com/admin/objects-rules/tickets/ticket-forms/edit/${ticketForm.id}`}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "l" },
              windows: { modifiers: ["ctrl"], key: "l" },
            }}
          />
          <Action.OpenInBrowser
            title="Open Ticket Form Conditions"
            url={`https://${instance?.subdomain}.zendesk.com/admin/objects-rules/tickets/ticket-forms/edit/${ticketForm.id}/conditions`}
            shortcut={Keyboard.Shortcut.Common.Edit}
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
            shortcut={Keyboard.Shortcut.Common.Open}
          />
          <Action.CopyToClipboard
            title="Copy Link to Clipboard"
            content={`https://${instance?.subdomain}.zendesk.com/admin/people/groups/${group.id}`}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "l" },
              windows: { modifiers: ["ctrl"], key: "l" },
            }}
          />
        </>
      );
    } else if (searchType === "tickets") {
      const ticket = item as ZendeskTicket;
      return (
        <>
          <Action.OpenInBrowser
            title="Open Ticket"
            url={`https://${instance?.subdomain}.zendesk.com/agent/tickets/${ticket.id}`}
            shortcut={Keyboard.Shortcut.Common.Open}
          />
          <Action.CopyToClipboard
            title="Copy Link to Clipboard"
            content={`https://${instance?.subdomain}.zendesk.com/agent/tickets/${ticket.id}`}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "l" },
              windows: { modifiers: ["ctrl"], key: "l" },
            }}
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
            shortcut={Keyboard.Shortcut.Common.Open}
          />
          <Action.OpenInBrowser
            title="Open Admin Edit View"
            url={`https://${instance?.subdomain}.zendesk.com/admin/workspaces/agent-workspace/views/${view.id}`}
            shortcut={Keyboard.Shortcut.Common.Edit}
          />
          <Action.OpenInBrowser
            title="Open Admin Views Page"
            url={`https://${instance?.subdomain}.zendesk.com/admin/workspaces/agent-workspace/views`}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "w" },
              windows: { modifiers: ["ctrl"], key: "w" },
            }}
          />
          <Action.CopyToClipboard
            title="Copy Agent View Link"
            content={`https://${instance?.subdomain}.zendesk.com/agent/views/${view.id}`}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "l" },
              windows: { modifiers: ["ctrl"], key: "l" },
            }}
          />
        </>
      );
    } else if (searchType === "brands") {
      const brand = item as ZendeskBrand;
      return (
        <>
          <Action.OpenInBrowser
            title="Open in Zendesk"
            url={`https://${instance?.subdomain}.zendesk.com/admin/account/brand_management/brands/${brand.id}`}
            shortcut={Keyboard.Shortcut.Common.Open}
          />
          {brand.has_help_center && brand.brand_url && (
            <Action.OpenInBrowser
              title="Open Help Center"
              url={brand.brand_url}
              shortcut={{
                macOS: { modifiers: ["cmd"], key: "h" },
                windows: { modifiers: ["ctrl"], key: "h" },
              }}
            />
          )}
          <Action.CopyToClipboard
            title="Copy Brand Link"
            content={`https://${instance?.subdomain}.zendesk.com/admin/account/brand_management/brands/${brand.id}`}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "l" },
              windows: { modifiers: ["ctrl"], key: "l" },
            }}
          />
        </>
      );
    } else if (searchType === "automations") {
      const automation = item as ZendeskAutomation;
      return (
        <>
          <Action.OpenInBrowser
            title="Open in Zendesk"
            url={`https://${instance?.subdomain}.zendesk.com/admin/objects-rules/rules/automations/${automation.id}`}
            shortcut={Keyboard.Shortcut.Common.Open}
          />
          <Action.CopyToClipboard
            title="Copy Automation Link"
            content={`https://${instance?.subdomain}.zendesk.com/admin/objects-rules/rules/automations/${automation.id}`}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "l" },
              windows: { modifiers: ["ctrl"], key: "l" },
            }}
          />
        </>
      );
    } else if (searchType === "custom_roles") {
      const customRole = item as ZendeskCustomRole;
      return (
        <>
          <Action.OpenInBrowser
            title="Open in Zendesk"
            url={`https://${instance?.subdomain}.zendesk.com/admin/people/team/roles/${customRole.id}`}
            shortcut={Keyboard.Shortcut.Common.Open}
          />
          <Action.CopyToClipboard
            title="Copy Role Link"
            content={`https://${instance?.subdomain}.zendesk.com/admin/people/team/roles/${customRole.id}`}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "l" },
              windows: { modifiers: ["ctrl"], key: "l" },
            }}
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
          <Action.Push
            title="Edit User"
            icon={Icon.Pencil}
            target={<EditUserForm user={user} instance={instance} />}
            shortcut={Keyboard.Shortcut.Common.Edit}
          />
          <Action.Push
            title="Create User"
            icon={Icon.Plus}
            target={<CreateUserForm instance={instance} />}
            shortcut={Keyboard.Shortcut.Common.New}
          />
          {(user.role === "agent" || user.role === "admin") && (
            <Action.Push
              title="View User's Group Memberships"
              icon={Icon.Person}
              target={<UserGroupMembershipsList userId={user.id} userName={user.name} instance={instance} />}
              shortcut={{
                macOS: { modifiers: ["cmd"], key: "g" },
                windows: { modifiers: ["ctrl"], key: "g" },
              }}
            />
          )}
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
              shortcut={Keyboard.Shortcut.Common.New}
            />
            <Action.Push
              title="View Options"
              icon={Icon.List}
              target={<TicketFieldOptionsList ticketField={ticketField} instance={instance} />}
              shortcut={{
                macOS: { modifiers: ["cmd"], key: "v" },
                windows: { modifiers: ["ctrl"], key: "v" },
              }}
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
      return (
        <>
          <Action.Push
            title="View Group Memberships"
            icon={Icon.Person}
            target={<GroupMembershipsList groupId={group.id} groupName={group.name} instance={instance} />}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "m" },
              windows: { modifiers: ["ctrl"], key: "m" },
            }}
          />
          {renderViewTicketsAction("group", group.id.toString())}
        </>
      );
    } else if (searchType === "brands") {
      const brand = item as ZendeskBrand;
      return <>{renderViewTicketsAction("brand", brand.id.toString())}</>;
    } else if (searchType === "automations") {
      // Automations don't have specific entity actions like viewing tickets
      return null;
    } else if (searchType === "custom_roles") {
      const customRole = item as ZendeskCustomRole;
      return (
        <>
          <Action.Push
            title="View Role Members"
            icon={Icon.Person}
            target={<EntityTicketsList entityType="role" entityId={customRole.id.toString()} instance={instance} />}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "m" },
              windows: { modifiers: ["ctrl"], key: "m" },
            }}
          />
        </>
      );
    } else if (searchType === "group_memberships") {
      const membership = item as ZendeskGroupMembership;
      return (
        <>
          <Action.OpenInBrowser
            title="Open User Profile"
            url={`https://${instance?.subdomain}.zendesk.com/agent/users/${membership.user_id}`}
            shortcut={Keyboard.Shortcut.Common.Open}
          />
          <Action.OpenInBrowser
            title="Open Group Details"
            url={`https://${instance?.subdomain}.zendesk.com/admin/people/groups/${membership.group_id}`}
            shortcut={{
              macOS: { modifiers: ["cmd"], key: "g" },
              windows: { modifiers: ["ctrl"], key: "g" },
            }}
          />
        </>
      );
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
    } else if (searchType === "brands") {
      generalConfigUrl = `${generalConfigUrl}/admin/brands`;
      shortcutKey = "b";
    } else if (searchType === "automations") {
      generalConfigUrl = `${generalConfigUrl}/admin/objects-rules/rules/automations`;
      shortcutKey = "n";
    } else if (searchType === "custom_roles") {
      generalConfigUrl = `${generalConfigUrl}/admin/people/roles`;
      shortcutKey = "r";
    }

    actions.push(
      <Action.OpenInBrowser
        key="general-config"
        title="Open General Configuration"
        url={generalConfigUrl}
        shortcut={
          shortcutKey
            ? {
                macOS: { modifiers: ["cmd", "shift"], key: shortcutKey },
                windows: { modifiers: ["ctrl", "shift"], key: shortcutKey },
              }
            : undefined
        }
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
          shortcut={{
            macOS: { modifiers: ["cmd"], key: "d" },
            windows: { modifiers: ["ctrl"], key: "d" },
          }}
        />,
      );
    }

    actions.push(
      <ActionPanel.Submenu key="change-instance" title="Change Instance" icon={Icon.House}>
        {allInstances.map((inst, index) => {
          const keyMap: { [key: number]: Keyboard.KeyEquivalent } = {
            0: "0",
            1: "1",
            2: "2",
            3: "3",
            4: "4",
            5: "5",
            6: "6",
            7: "7",
            8: "8",
            9: "9",
          };
          const key = index < 9 ? keyMap[index + 1] : keyMap[0];

          return (
            <Action
              key={inst.subdomain}
              title={`${inst.subdomain}`}
              icon={instance?.subdomain === inst.subdomain ? { source: Icon.Dot, tintColor: Color.Green } : undefined}
              onAction={() => onInstanceChange(inst)}
              shortcut={{
                macOS: { modifiers: ["cmd"], key },
                windows: { modifiers: ["ctrl"], key },
              }}
            />
          );
        })}
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
