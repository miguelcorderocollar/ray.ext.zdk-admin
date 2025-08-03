import { ActionPanel, Action, Icon, Keyboard, Color } from "@raycast/api";
import { getZendeskInstances, ZendeskInstance } from "../../utils/preferences";
import { getZendeskUrls } from "../../utils/zendeskUrls";
import {
  createOpenAndCopyActions,
  createCopyAction,
  createCopyActionWithShortcut,
  createOpenAction,
  createOpenActionWithShortcut,
} from "../../utils/actionBuilders";
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
import UserMembershipList from "../lists/UserMembershipList";
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
  const urls = getZendeskUrls(instance);

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
      const userUrl = urls.getUserProfile(user.id);
      return <>{createOpenAndCopyActions(userUrl, "Open in Browser")}</>;
    } else if (searchType === "organizations") {
      const organization = item as ZendeskOrganization;
      const orgUrl = urls.getOrganizationDetails(organization.id);
      return <>{createOpenAndCopyActions(orgUrl, "Open in Browser")}</>;
    } else if (searchType === "dynamic_content") {
      const dynamicContent = item as ZendeskDynamicContent;
      const defaultVariant = dynamicContent.variants?.find((v) => v.default === true);
      const dynamicContentUrl = urls.getDynamicContentItem(dynamicContent.id);
      return (
        <>
          {createOpenAction(dynamicContentUrl, "Open Dynamic Content")}
          {createCopyAction(dynamicContentUrl, "Copy Link to Clipboard")}
          {defaultVariant &&
            createCopyActionWithShortcut(defaultVariant.content, "Copy Content to Clipboard", {
              macOS: { modifiers: ["cmd", "shift"], key: "v" },
              windows: { modifiers: ["ctrl", "shift"], key: "v" },
            })}
          {createCopyActionWithShortcut(
            dynamicContent.placeholder,
            "Copy Placeholder to Clipboard",
            Keyboard.Shortcut.Common.CopyName,
          )}
        </>
      );
    } else if (searchType === "macros") {
      const macro = item as ZendeskMacro;
      const macroUrl = urls.getMacroDetails(macro.id);
      return <>{createOpenAndCopyActions(macroUrl, "Open Macro in Zendesk")}</>;
    } else if (searchType === "triggers") {
      const trigger = item as ZendeskTrigger;
      const triggerUrl = urls.getTriggerDetails(trigger.id);
      return (
        <>
          {createOpenAction(triggerUrl, "Open in Browser")}
          {createCopyAction(triggerUrl, "Copy URL to Clipboard")}
        </>
      );
    } else if (searchType === "ticket_fields") {
      const ticketField = item as ZendeskTicketField;
      const ticketFieldUrl = urls.getTicketFieldDetails(ticketField.id);
      return (
        <>
          {createOpenAction(ticketFieldUrl, "Open Ticket Field")}
          {createCopyAction(ticketFieldUrl, "Copy Link to Clipboard")}
        </>
      );
    } else if (searchType === "support_addresses") {
      const supportAddress = item as ZendeskSupportAddress;
      return <>{createCopyAction(supportAddress.email, "Copy Email to Clipboard")}</>;
    } else if (searchType === "ticket_forms") {
      const ticketForm = item as ZendeskTicketForm;
      const ticketFormUrl = urls.getTicketFormDetails(ticketForm.id);
      const ticketFormConditionsUrl = urls.getTicketFormConditions(ticketForm.id);
      return (
        <>
          {createOpenAction(ticketFormUrl, "Open Ticket Form")}
          {createCopyAction(ticketFormUrl, "Copy Link to Clipboard")}
          {createOpenActionWithShortcut(
            ticketFormConditionsUrl,
            "Open Ticket Form Conditions",
            Keyboard.Shortcut.Common.Edit,
          )}
        </>
      );
    } else if (searchType === "groups") {
      const group = item as ZendeskGroup;
      const groupUrl = urls.getGroupDetails(group.id);
      return <>{createOpenAndCopyActions(groupUrl, "Open Group Details")}</>;
    } else if (searchType === "tickets") {
      const ticket = item as ZendeskTicket;
      const ticketUrl = urls.getTicketDetails(ticket.id);
      return <>{createOpenAndCopyActions(ticketUrl, "Open Ticket")}</>;
    } else if (searchType === "views") {
      const view = item as ZendeskView;
      const agentViewUrl = urls.getAgentView(view.id);
      const adminViewUrl = urls.getAdminViewEdit(view.id);
      const viewsListUrl = urls.getViewsList();
      return (
        <>
          {createOpenAction(agentViewUrl, "Open Agent View")}
          {createOpenActionWithShortcut(adminViewUrl, "Open Admin Edit View", Keyboard.Shortcut.Common.Edit)}
          {createOpenActionWithShortcut(viewsListUrl, "Open Admin Views Page", {
            macOS: { modifiers: ["cmd"], key: "b" },
            windows: { modifiers: ["ctrl"], key: "b" },
          })}
          {createCopyAction(agentViewUrl, "Copy Agent View Link")}
        </>
      );
    } else if (searchType === "brands") {
      const brand = item as ZendeskBrand;
      const brandUrl = urls.getBrandDetails(brand.id);
      return (
        <>
          {createOpenAction(brandUrl, "Open in Zendesk")}
          {brand.has_help_center &&
            brand.brand_url &&
            createOpenActionWithShortcut(brand.brand_url, "Open Help Center", {
              macOS: { modifiers: ["cmd"], key: "h" },
              windows: { modifiers: ["ctrl"], key: "h" },
            })}
          {createCopyAction(brandUrl, "Copy Brand Link")}
        </>
      );
    } else if (searchType === "automations") {
      const automation = item as ZendeskAutomation;
      const automationUrl = urls.getAutomationDetails(automation.id);
      return <>{createOpenAndCopyActions(automationUrl, "Open in Zendesk")}</>;
    } else if (searchType === "custom_roles") {
      const customRole = item as ZendeskCustomRole;
      const customRoleUrl = urls.getCustomRoleDetails(customRole.id);
      return <>{createOpenAndCopyActions(customRoleUrl, "Open in Zendesk")}</>;
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
            target={
              <UserMembershipList entityType="group" entityId={group.id} entityName={group.name} instance={instance} />
            }
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
          {createOpenAction(urls.getUserProfile(membership.user_id), "Open User Profile")}
          {createOpenActionWithShortcut(urls.getGroupDetails(membership.group_id), "Open Group Details", {
            macOS: { modifiers: ["cmd"], key: "g" },
            windows: { modifiers: ["ctrl"], key: "g" },
          })}
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
