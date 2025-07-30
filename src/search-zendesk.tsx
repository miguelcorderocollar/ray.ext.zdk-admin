import { List, showToast, Toast, ActionPanel, Action, Image, Icon, Color } from "@raycast/api";
import { getZendeskPreferences } from "./utils/preferences";
import { useState, useEffect } from "react";
import {
  searchZendeskUsers,
  getZendeskUrl,
  ZendeskUser,
  searchZendeskOrganizations,
  ZendeskOrganization,
  searchZendeskTriggers,
  ZendeskTrigger,
  searchZendeskDynamicContent,
  ZendeskDynamicContent,
  searchZendeskMacros,
  ZendeskMacro,
} from "./api/zendesk";
import EditUserForm from "./components/EditUserForm";

// Custom useDebounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchZendesk() {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const [results, setResults] = useState<
    ZendeskUser[] | ZendeskOrganization[] | ZendeskTrigger[] | ZendeskDynamicContent[] | ZendeskMacro[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<"users" | "organizations" | "triggers" | "dynamic_content" | "macros">(
    "users",
  );

  useEffect(() => {
    async function performSearch() {
      if (!debouncedSearchText && searchType !== "dynamic_content" && searchType !== "macros") {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        let searchResults:
          | ZendeskUser[]
          | ZendeskOrganization[]
          | ZendeskTrigger[]
          | ZendeskDynamicContent[]
          | ZendeskMacro[];
        if (searchType === "users") {
          searchResults = await searchZendeskUsers(debouncedSearchText);
        } else if (searchType === "organizations") {
          searchResults = await searchZendeskOrganizations(debouncedSearchText);
        } else if (searchType === "dynamic_content") {
          searchResults = await searchZendeskDynamicContent(debouncedSearchText);
        } else if (searchType === "macros") {
          searchResults = await searchZendeskMacros(debouncedSearchText);
        } else {
          searchResults = await searchZendeskTriggers(debouncedSearchText);
        }
        setResults(searchResults);
      } catch (error: unknown) {
        let errorMessage = "An unknown error occurred.";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        showToast(Toast.Style.Failure, "Search Failed", errorMessage);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [debouncedSearchText, searchType]);

  return (
    <List
      isShowingDetail
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder={
        searchType === "users"
          ? "Search Zendesk users by name, email, etc."
          : searchType === "organizations"
            ? "Search Zendesk organizations by name, domain, etc."
            : searchType === "dynamic_content"
              ? "Search Zendesk dynamic content by name or content"
              : searchType === "macros"
                ? "Search Zendesk macros by name or description"
                : "Search Zendesk triggers by name"
      }
      throttle
      searchBarAccessory={
        <List.Dropdown
          onChange={(newValue) =>
            setSearchType(newValue as "users" | "organizations" | "triggers" | "dynamic_content" | "macros")
          }
          tooltip="Select Search Type"
          value={searchType}
        >
          <List.Dropdown.Section title="Ticketing">
            <List.Dropdown.Item title="Users" value="users" />
            <List.Dropdown.Item title="Organizations" value="organizations" />
          </List.Dropdown.Section>
          <List.Dropdown.Section title="Admin">
            <List.Dropdown.Item title="Triggers" value="triggers" />
            <List.Dropdown.Item title="Dynamic Content" value="dynamic_content" />
            <List.Dropdown.Item title="Macros" value="macros" />
          </List.Dropdown.Section>
        </List.Dropdown>
      }
    >
      {(results || []).length === 0 && !isLoading && searchText.length > 0 && (
        <List.EmptyView title="No Results Found" description="Try a different search query." />
      )}
      {(results || []).length === 0 && !isLoading && searchText.length === 0 && (
        <List.EmptyView
          title={`Start Typing to Search ${searchType === "users" ? "Users" : searchType === "organizations" ? "Organizations" : searchType === "dynamic_content" ? "Dynamic Content" : searchType === "macros" ? "Macros" : "Triggers"}`}
          description={`Enter a name, email, or other keyword to find Zendesk ${searchType}.`}
        />
      )}
      {(results || []).map((item) => {
        if (searchType === "users") {
          const user = item as ZendeskUser;
          const hasDetailsOrNotes = user.details || user.notes;
          const hasTimestamps = user.created_at || user.updated_at;

          return (
            <List.Item
              key={user.id}
              title={user.name}
              icon={
                user.photo?.content_url
                  ? { source: user.photo.content_url, mask: Image.Mask.Circle }
                  : { source: "placeholder-user.svg", mask: Image.Mask.Circle }
              }
              detail={
                <List.Item.Detail
                  metadata={
                    <List.Item.Detail.Metadata>
                      <List.Item.Detail.Metadata.Label title="Name" text={user.name} />
                      <List.Item.Detail.Metadata.Label title="ID" text={user.id.toString()} />
                      <List.Item.Detail.Metadata.Label title="Email" text={user.email} />
                      {user.alias && <List.Item.Detail.Metadata.Label title="Alias" text={user.alias} />}
                      {user.phone && <List.Item.Detail.Metadata.Label title="Phone" text={user.phone} />}
                      {user.role && (
                        <List.Item.Detail.Metadata.TagList title="Role">
                          <List.Item.Detail.Metadata.TagList.Item
                            text={user.role}
                            color={(() => {
                              switch (user.role) {
                                case "end-user":
                                  return Color.Blue;
                                case "agent":
                                  return Color.Green;
                                case "admin":
                                  return Color.Red;
                                default:
                                  return Color.PrimaryText;
                              }
                            })()}
                          />
                        </List.Item.Detail.Metadata.TagList>
                      )}
                      {user.tags && user.tags.length > 0 && (
                        <List.Item.Detail.Metadata.TagList title="Tags">
                          {user.tags.map((tag) => (
                            <List.Item.Detail.Metadata.TagList.Item key={tag} text={tag} />
                          ))}
                        </List.Item.Detail.Metadata.TagList>
                      )}

                      {hasDetailsOrNotes && (
                        <>
                          <List.Item.Detail.Metadata.Separator />
                          {user.details && <List.Item.Detail.Metadata.Label title="Details" text={user.details} />}
                          {user.notes && <List.Item.Detail.Metadata.Label title="Notes" text={user.notes} />}
                        </>
                      )}

                      {hasTimestamps && (
                        <>
                          <List.Item.Detail.Metadata.Separator />
                          {user.created_at && (
                            <List.Item.Detail.Metadata.Label
                              title="Created At"
                              text={new Date(user.created_at).toLocaleString()}
                            />
                          )}
                          {user.updated_at && (
                            <List.Item.Detail.Metadata.Label
                              title="Updated At"
                              text={new Date(user.updated_at).toLocaleString()}
                            />
                          )}
                        </>
                      )}

                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.Link
                        title="Open in Zendesk"
                        text="View User Profile"
                        target={`${getZendeskUrl().replace("/api/v2", "")}/agent/users/${user.id}`}
                      />
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ActionPanel>
                  <ActionPanel.Section title="Open">
                    <Action.OpenInBrowser
                      title="Open in Browser"
                      url={`${getZendeskUrl().replace("/api/v2", "")}/agent/users/${user.id}`}
                    />
                    <Action.CopyToClipboard
                      title="Copy Link"
                      content={`${getZendeskUrl().replace("/api/v2", "")}/agent/users/${user.id}`}
                    />
                  </ActionPanel.Section>
                  <ActionPanel.Section title="Edit">
                    <Action.Push title="Edit User" icon={Icon.Pencil} target={<EditUserForm user={user} />} />
                  </ActionPanel.Section>
                  <ActionPanel.Section title="General">
                    <Action.OpenInBrowser
                      title="Open General Configuration"
                      url={`${getZendeskUrl().replace("/api/v2", "")}/agent/user_filters`}
                      shortcut={{ modifiers: ["cmd", "shift"], key: "u" }}
                    />
                    <ActionPanel.Submenu title="Change Instance" icon={{ source: Icon.House }}>
                      <Action.OpenInBrowser
                        title={`${getZendeskPreferences().zendeskSubdomain}`}
                        url={`${getZendeskUrl().replace("/api/v2", "")}`}
                        icon={{ source: Icon.House, tintColor: getZendeskPreferences().instanceColor || Color.Blue }}
                      />
                      <Action.OpenInBrowser
                        title="Instance 2"
                        url={`${getZendeskUrl().replace("/api/v2", "")}`}
                        icon={{ source: Icon.House, tintColor: Color.Red }}
                      />
                      <Action.OpenInBrowser
                        title="Instance 3"
                        url={`${getZendeskUrl().replace("/api/v2", "")}`}
                        icon={{ source: Icon.House, tintColor: Color.Green }}
                      />
                    </ActionPanel.Submenu>
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          );
        } else if (searchType === "organizations") {
          const organization = item as ZendeskOrganization;
          const hasDetailsOrNotes = organization.details || organization.notes;
          const hasTimestamps = organization.created_at || organization.updated_at;

          return (
            <List.Item
              key={organization.id}
              title={organization.name}
              icon={undefined}
              detail={
                <List.Item.Detail
                  metadata={
                    <List.Item.Detail.Metadata>
                      <List.Item.Detail.Metadata.Label title="Name" text={organization.name} />
                      <List.Item.Detail.Metadata.Label title="ID" text={organization.id.toString()} />
                      {organization.domain_names && organization.domain_names.length > 0 && (
                        <List.Item.Detail.Metadata.TagList title="Domains">
                          {organization.domain_names.map((domain) => (
                            <List.Item.Detail.Metadata.TagList.Item key={domain} text={domain} />
                          ))}
                        </List.Item.Detail.Metadata.TagList>
                      )}

                      {hasDetailsOrNotes && (
                        <>
                          <List.Item.Detail.Metadata.Separator />
                          {organization.details && (
                            <List.Item.Detail.Metadata.Label title="Details" text={organization.details} />
                          )}
                          {organization.notes && (
                            <List.Item.Detail.Metadata.Label title="Notes" text={organization.notes} />
                          )}
                        </>
                      )}

                      {(hasTimestamps || organization.external_id) && <List.Item.Detail.Metadata.Separator />}

                      {organization.external_id && (
                        <List.Item.Detail.Metadata.Label title="External ID" text={organization.external_id} />
                      )}
                      {organization.created_at && (
                        <List.Item.Detail.Metadata.Label
                          title="Created At"
                          text={new Date(organization.created_at).toLocaleString()}
                        />
                      )}
                      {organization.updated_at && (
                        <List.Item.Detail.Metadata.Label
                          title="Updated At"
                          text={new Date(organization.updated_at).toLocaleString()}
                        />
                      )}

                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.Link
                        title="Open in Zendesk"
                        text="View Organization Profile"
                        target={`${getZendeskUrl().replace("/api/v2", "")}/agent/organizations/${organization.id}`}
                      />
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ActionPanel>
                  <ActionPanel.Section title="Open">
                    <Action.OpenInBrowser
                      title="Open in Browser"
                      url={`${getZendeskUrl().replace("/api/v2", "")}/agent/organizations/${organization.id}`}
                    />
                    <Action.CopyToClipboard
                      title="Copy Link"
                      content={`${getZendeskUrl().replace("/api/v2", "")}/agent/organizations/${organization.id}`}
                    />
                  </ActionPanel.Section>
                  <ActionPanel.Section title="General">
                    <Action.OpenInBrowser
                      title="Open General Configuration"
                      url={`${getZendeskUrl().replace("/api/v2", "")}/agent/organizations`}
                      shortcut={{ modifiers: ["cmd", "shift"], key: "o" }}
                    />
                    <ActionPanel.Submenu title="Change Instance" icon={{ source: Icon.House }}>
                      <Action.OpenInBrowser
                        title={`${getZendeskPreferences().zendeskSubdomain}`}
                        url={`${getZendeskUrl().replace("/api/v2", "")}`}
                        icon={{ source: Icon.House, tintColor: getZendeskPreferences().instanceColor || Color.Blue }}
                      />
                      <Action.OpenInBrowser
                        title="Instance 2"
                        url={`${getZendeskUrl().replace("/api/v2", "")}`}
                        icon={{ source: Icon.House, tintColor: Color.Red }}
                      />
                      <Action.OpenInBrowser
                        title="Instance 3"
                        url={`${getZendeskUrl().replace("/api/v2", "")}`}
                        icon={{ source: Icon.House, tintColor: Color.Green }}
                      />
                    </ActionPanel.Submenu>
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          );
        } else if (searchType === "dynamic_content") {
          const dynamicContent = item as ZendeskDynamicContent;
          const nameParts = (dynamicContent.name ?? "").split("::");
          const title = nameParts.length > 1 ? nameParts[nameParts.length - 1] : dynamicContent.name;
          const tags = nameParts.length > 1 ? nameParts.slice(0, nameParts.length - 1) : [];
          const defaultVariant = dynamicContent.variants?.find((v) => v.id === dynamicContent.default_locale_id);

          return (
            <List.Item
              key={dynamicContent.id}
              title={title}
              accessories={
                tags.length > 2
                  ? [...tags.slice(0, 2).map((tag) => ({ text: tag })), { text: "..." }]
                  : tags.map((tag) => ({ text: tag }))
              }
              detail={
                <List.Item.Detail
                  metadata={
                    <List.Item.Detail.Metadata>
                      <List.Item.Detail.Metadata.Label title="Name" text={dynamicContent.name} />
                      <List.Item.Detail.Metadata.Label title="ID" text={dynamicContent.id.toString()} />
                      <List.Item.Detail.Metadata.Label title="Placeholder" text={dynamicContent.placeholder} />
                      <List.Item.Detail.Metadata.Label
                        title="Created At"
                        text={new Date(dynamicContent.created_at).toLocaleString()}
                      />
                      <List.Item.Detail.Metadata.Label
                        title="Updated At"
                        text={new Date(dynamicContent.updated_at).toLocaleString()}
                      />
                      {defaultVariant && (
                        <List.Item.Detail.Metadata.Label title="Content" text={defaultVariant.content} />
                      )}
                      <List.Item.Detail.Metadata.TagList title="Locales">
                        {dynamicContent.variants?.map((variant) => (
                          <List.Item.Detail.Metadata.TagList.Item key={variant.id} text={`${variant.locale_id}`} />
                        ))}
                      </List.Item.Detail.Metadata.TagList>
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ActionPanel>
                  <ActionPanel.Section title="Open">
                    <Action.OpenInBrowser
                      title="Open Dynamic Content"
                      url={`${getZendeskUrl().replace("/api/v2", "")}/dynamic_content/items/${dynamicContent.id}`}
                    />
                    <Action.CopyToClipboard
                      title="Copy Link to Clipboard"
                      content={`${getZendeskUrl().replace("/api/v2", "")}/dynamic_content/items/${dynamicContent.id}`}
                    />
                    {defaultVariant && (
                      <Action.CopyToClipboard title="Copy Content to Clipboard" content={defaultVariant.content} />
                    )}
                  </ActionPanel.Section>
                  <ActionPanel.Section title="General">
                    <Action.OpenInBrowser
                      title="Open General Configuration"
                      url={`${getZendeskUrl().replace("/api/v2", "")}/admin/workspaces/agent-workspace/dynamic_content`}
                      shortcut={{ modifiers: ["cmd", "shift"], key: "d" }}
                    />
                    <ActionPanel.Submenu title="Change Instance" icon={{ source: Icon.House }}>
                      <Action.OpenInBrowser
                        title={`${getZendeskPreferences().zendeskSubdomain}`}
                        url={`${getZendeskUrl().replace("/api/v2", "")}`}
                        icon={{ source: Icon.House, tintColor: getZendeskPreferences().instanceColor || Color.Blue }}
                      />
                      <Action.OpenInBrowser
                        title="Instance 2"
                        url={`${getZendeskUrl().replace("/api/v2", "")}`}
                        icon={{ source: Icon.House, tintColor: Color.Red }}
                      />
                      <Action.OpenInBrowser
                        title="Instance 3"
                        url={`${getZendeskUrl().replace("/api/v2", "")}`}
                        icon={{ source: Icon.House, tintColor: Color.Green }}
                      />
                    </ActionPanel.Submenu>
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          );
        } else if (searchType === "macros") {
          const macro = item as ZendeskMacro;
          const nameParts = macro.title?.split("::");
          const title = nameParts.length > 1 ? nameParts[nameParts.length - 1] : macro.title;
          const tags = nameParts.length > 1 ? nameParts.slice(0, nameParts.length - 1) : [];

          return (
            <List.Item
              key={macro.id}
              title={title}
              accessories={
                tags.length > 2
                  ? [...tags.slice(0, 2).map((tag) => ({ text: tag })), { text: "..." }]
                  : tags.map((tag) => ({ text: tag }))
              }
              detail={
                <List.Item.Detail
                  metadata={
                    <List.Item.Detail.Metadata>
                      <List.Item.Detail.Metadata.Label title="Name" text={macro.title} />
                      <List.Item.Detail.Metadata.Label title="ID" text={macro.id.toString()} />
                      <List.Item.Detail.Metadata.Label title="Active" text={macro.active ? "Yes" : "No"} />
                      {macro.description && (
                        <List.Item.Detail.Metadata.Label title="Description" text={macro.description} />
                      )}
                      <List.Item.Detail.Metadata.Label
                        title="Created At"
                        text={new Date(macro.created_at).toLocaleString()}
                      />
                      <List.Item.Detail.Metadata.Label
                        title="Updated At"
                        text={new Date(macro.updated_at).toLocaleString()}
                      />
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ActionPanel>
                  <ActionPanel.Section title="Open">
                    <Action.OpenInBrowser
                      title="Open Macro in Zendesk"
                      url={`${getZendeskUrl().replace("/api/v2", "")}/admin/workspaces/agent-workspace/macros/${macro.id}`}
                    />
                    <Action.CopyToClipboard
                      title="Copy Macro Link"
                      content={`${getZendeskUrl().replace("/api/v2", "")}/admin/workspaces/agent-workspace/macros/${macro.id}`}
                    />
                  </ActionPanel.Section>
                  <ActionPanel.Section title="General">
                    <Action.OpenInBrowser
                      title="Open General Configuration"
                      url={`${getZendeskUrl().replace("/api/v2", "")}/admin/workspaces/agent-workspace/macros`}
                      shortcut={{ modifiers: ["cmd", "shift"], key: "m" }}
                    />
                    <ActionPanel.Submenu title="Change Instance" icon={{ source: Icon.House }}>
                      <Action.OpenInBrowser
                        title={`${getZendeskPreferences().zendeskSubdomain}`}
                        url={`${getZendeskUrl().replace("/api/v2", "")}`}
                        icon={{ source: Icon.House, tintColor: getZendeskPreferences().instanceColor || Color.Blue }}
                      />
                      <Action.OpenInBrowser
                        title="Instance 2"
                        url={`${getZendeskUrl().replace("/api/v2", "")}`}
                        icon={{ source: Icon.House, tintColor: Color.Red }}
                      />
                      <Action.OpenInBrowser
                        title="Instance 3"
                        url={`${getZendeskUrl().replace("/api/v2", "")}`}
                        icon={{ source: Icon.House, tintColor: Color.Green }}
                      />
                    </ActionPanel.Submenu>
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          );
        } else {
          const trigger = item as unknown as ZendeskTrigger;
          return (
            <List.Item
              key={trigger.id}
              title={trigger.title}
              icon={undefined}
              detail={
                <List.Item.Detail
                  metadata={
                    <List.Item.Detail.Metadata>
                      <List.Item.Detail.Metadata.Label title="Title" text={trigger.title} />
                      <List.Item.Detail.Metadata.Label title="ID" text={trigger.id.toString()} />
                      <List.Item.Detail.Metadata.Label title="Category ID" text={trigger.category_id} />
                      <List.Item.Detail.Metadata.TagList title="Active">
                        <List.Item.Detail.Metadata.TagList.Item
                          text={trigger.active ? "Active" : "Inactive"}
                          color={trigger.active ? Color.Green : Color.Red}
                        />
                      </List.Item.Detail.Metadata.TagList>
                      {trigger.created_at && (
                        <List.Item.Detail.Metadata.Label
                          title="Created At"
                          text={new Date(trigger.created_at).toLocaleString()}
                        />
                      )}
                      {trigger.updated_at && (
                        <List.Item.Detail.Metadata.Label
                          title="Updated At"
                          text={new Date(trigger.updated_at).toLocaleString()}
                        />
                      )}
                      <List.Item.Detail.Metadata.Separator />
                      <List.Item.Detail.Metadata.Link
                        title="Open in Zendesk"
                        text="View Trigger"
                        target={`${getZendeskUrl().replace("/api/v2", "")}/admin/objects-rules/rules/triggers/${trigger.id}`}
                      />
                    </List.Item.Detail.Metadata>
                  }
                />
              }
              actions={
                <ActionPanel>
                  <ActionPanel.Section title="Open">
                    <Action.OpenInBrowser
                      title="Open in Browser"
                      url={`${getZendeskUrl().replace("/api/v2", "")}/admin/objects-rules/rules/triggers/${trigger.id}`}
                    />
                    <Action.CopyToClipboard
                      title="Copy URL to Clipboard"
                      content={`${getZendeskUrl().replace("/api/v2", "")}/admin/objects-rules/rules/triggers/${trigger.id}`}
                    />
                  </ActionPanel.Section>
                  <ActionPanel.Section title="General">
                    <Action.OpenInBrowser
                      title="Open General Configuration"
                      url={`${getZendeskUrl().replace("/api/v2", "")}/admin/objects-rules/rules/triggers`}
                      shortcut={{ modifiers: ["cmd", "shift"], key: "t" }}
                    />
                    <ActionPanel.Submenu title="Change Instance" icon={{ source: Icon.House }}>
                      <Action.OpenInBrowser
                        title={`${getZendeskPreferences().zendeskSubdomain}`}
                        url={`${getZendeskUrl().replace("/api/v2", "")}`}
                        icon={{ source: Icon.House, tintColor: getZendeskPreferences().instanceColor || Color.Blue }}
                      />
                      <Action.OpenInBrowser
                        title="Instance 2"
                        url={`${getZendeskUrl().replace("/api/v2", "")}`}
                        icon={{ source: Icon.House, tintColor: Color.Red }}
                      />
                      <Action.OpenInBrowser
                        title="Instance 3"
                        url={`${getZendeskUrl().replace("/api/v2", "")}`}
                        icon={{ source: Icon.House, tintColor: Color.Green }}
                      />
                    </ActionPanel.Submenu>
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          );
        }
      })}
    </List>
  );
}
