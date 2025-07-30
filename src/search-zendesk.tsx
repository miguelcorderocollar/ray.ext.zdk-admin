import { List, showToast, Toast, ActionPanel, Action, Image, Icon, Color } from "@raycast/api";
import { useState, useEffect } from "react";
import {
  searchZendeskUsers,
  getZendeskUrl,
  ZendeskUser,
  searchZendeskOrganizations,
  ZendeskOrganization,
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
  const [results, setResults] = useState<ZendeskUser[] | ZendeskOrganization[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState<"users" | "organizations">("users");

  useEffect(() => {
    async function performSearch() {
      if (!debouncedSearchText) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        let searchResults: ZendeskUser[] | ZendeskOrganization[];
        if (searchType === "users") {
          searchResults = await searchZendeskUsers(debouncedSearchText);
        } else {
          searchResults = await searchZendeskOrganizations(debouncedSearchText);
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
          : "Search Zendesk organizations by name, domain, etc."
      }
      throttle
      searchBarAccessory={
        <List.Dropdown
          onChange={(newValue) => setSearchType(newValue as "users" | "organizations")}
          tooltip="Select Search Type"
          value={searchType}
        >
          <List.Dropdown.Item title="Users" value="users" />
          <List.Dropdown.Item title="Organizations" value="organizations" />
        </List.Dropdown>
      }
    >
      {(results || []).length === 0 && !isLoading && searchText.length > 0 && (
        <List.EmptyView title="No Results Found" description="Try a different search query." />
      )}
      {(results || []).length === 0 && !isLoading && searchText.length === 0 && (
        <List.EmptyView
          title={`Start Typing to Search ${searchType === "users" ? "Users" : "Organizations"}`}
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
                  <Action.Push title="Edit User" icon={Icon.Pencil} target={<EditUserForm user={user} />} />
                  <Action.OpenInBrowser
                    title="Open in Browser"
                    url={`${getZendeskUrl().replace("/api/v2", "")}/agent/users/${user.id}`}
                  />
                  <Action.CopyToClipboard
                    title="Copy Link"
                    content={`${getZendeskUrl().replace("/api/v2", "")}/agent/users/${user.id}`}
                  />
                </ActionPanel>
              }
            />
          );
        } else {
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
                  <Action.OpenInBrowser
                    title="Open in Browser"
                    url={`${getZendeskUrl().replace("/api/v2", "")}/agent/organizations/${organization.id}`}
                  />
                  <Action.CopyToClipboard
                    title="Copy Link"
                    content={`${getZendeskUrl().replace("/api/v2", "")}/agent/organizations/${organization.id}`}
                  />
                </ActionPanel>
              }
            />
          );
        }
      })}
    </List>
  );
}
