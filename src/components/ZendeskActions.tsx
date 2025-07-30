import { ActionPanel, Action, Icon, KeyboardShortcut, Keyboard } from "@raycast/api";
import { getZendeskPreferences } from "../utils/preferences";
import {
  getZendeskUrl,
  ZendeskUser,
  ZendeskOrganization,
  ZendeskTrigger,
  ZendeskDynamicContent,
  ZendeskMacro,
} from "../api/zendesk";
import EditUserForm from "./EditUserForm";

interface ZendeskActionsProps {
  item: ZendeskUser | ZendeskOrganization | ZendeskTrigger | ZendeskDynamicContent | ZendeskMacro;
  searchType: "users" | "organizations" | "triggers" | "dynamic_content" | "macros";
}

export function ZendeskActions({ item, searchType }: ZendeskActionsProps) {
  const zendeskUrl = getZendeskUrl().replace("/api/v2", "");
  const preferences = getZendeskPreferences();

  const renderOpenActions = () => {
    if (searchType === "users") {
      const user = item as ZendeskUser;
      return (
        <>
          <Action.OpenInBrowser title="Open in Browser" url={`${zendeskUrl}/agent/users/${user.id}`} />
          <Action.CopyToClipboard title="Copy Link" content={`${zendeskUrl}/agent/users/${user.id}`} />
        </>
      );
    } else if (searchType === "organizations") {
      const organization = item as ZendeskOrganization;
      return (
        <>
          <Action.OpenInBrowser title="Open in Browser" url={`${zendeskUrl}/agent/organizations/${organization.id}`} />
          <Action.CopyToClipboard title="Copy Link" content={`${zendeskUrl}/agent/organizations/${organization.id}`} />
        </>
      );
    } else if (searchType === "dynamic_content") {
      const dynamicContent = item as ZendeskDynamicContent;
      const defaultVariant = dynamicContent.variants?.find((v) => v.id === dynamicContent.default_locale_id);
      return (
        <>
          <Action.OpenInBrowser
            title="Open Dynamic Content"
            url={`${zendeskUrl}/dynamic_content/items/${dynamicContent.id}`}
          />
          <Action.CopyToClipboard
            title="Copy Link to Clipboard"
            content={`${zendeskUrl}/dynamic_content/items/${dynamicContent.id}`}
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
            url={`${zendeskUrl}/admin/workspaces/agent-workspace/macros/${macro.id}`}
          />
          <Action.CopyToClipboard
            title="Copy Macro Link"
            content={`${zendeskUrl}/admin/workspaces/agent-workspace/macros/${macro.id}`}
          />
        </>
      );
    } else if (searchType === "triggers") {
      const trigger = item as ZendeskTrigger;
      return (
        <>
          <Action.OpenInBrowser
            title="Open in Browser"
            url={`${zendeskUrl}/admin/objects-rules/rules/triggers/${trigger.id}`}
          />
          <Action.CopyToClipboard
            title="Copy URL to Clipboard"
            content={`${zendeskUrl}/admin/objects-rules/rules/triggers/${trigger.id}`}
          />
        </>
      );
    }
    return null;
  };

  const renderEditActions = () => {
    if (searchType === "users") {
      const user = item as ZendeskUser;
      return <Action.Push title="Edit User" icon={Icon.Pencil} target={<EditUserForm user={user} />} />;
    }
    return null;
  };

  const renderGeneralActions = () => {
    let generalConfigUrl = "";
    let shortcutKey: Keyboard.KeyEquivalent | undefined = undefined;

    if (searchType === "users") {
      generalConfigUrl = `${zendeskUrl}/agent/user_filters`;
      shortcutKey = "u";
    } else if (searchType === "organizations") {
      generalConfigUrl = `${zendeskUrl}/agent/organizations`;
      shortcutKey = "o";
    } else if (searchType === "dynamic_content") {
      generalConfigUrl = `${zendeskUrl}/admin/workspaces/agent-workspace/dynamic_content`;
      shortcutKey = "d";
    } else if (searchType === "macros") {
      generalConfigUrl = `${zendeskUrl}/admin/workspaces/agent-workspace/macros`;
      shortcutKey = "m";
    } else if (searchType === "triggers") {
      generalConfigUrl = `${zendeskUrl}/admin/objects-rules/rules/triggers`;
      shortcutKey = "t";
    }

    return (
      <>
        <Action.OpenInBrowser
          title="Open General Configuration"
          url={generalConfigUrl}
          shortcut={shortcutKey ? { modifiers: ["cmd", "shift"], key: shortcutKey } : undefined}
        />
        <ActionPanel.Submenu title="Change Instance">
          <Action.OpenInBrowser
            title={`${preferences.zendeskSubdomain}.zendesk.com`}
            url={`${zendeskUrl}`}
            icon={{ source: Icon.House }}
          />
          <Action.OpenInBrowser title="Instance 2" url={`${zendeskUrl}`} icon={{ source: Icon.House }} />
          <Action.OpenInBrowser title="Instance 3" url={`${zendeskUrl}`} icon={{ source: Icon.House }} />
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
