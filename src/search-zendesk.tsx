import { List, showToast, Toast, ActionPanel, Action, Image } from "@raycast/api";
import { useState, useEffect } from "react";
import {
  searchZendeskUsers,
  getZendeskUrl,
  ZendeskUser,
  searchZendeskOrganizations,
  ZendeskOrganization,
} from "./api/zendesk";
import UserDetail from "./user-detail";
import OrganizationDetail from "./organization-detail";

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
          return (
            <List.Item
              key={user.id}
              title={user.name}
              subtitle={user.email}
              icon={
                user.photo?.content_url
                  ? { source: user.photo.content_url, mask: Image.Mask.Circle }
                  : { source: "placeholder-user.svg", mask: Image.Mask.Circle }
              }
              actions={
                <ActionPanel>
                  <Action.Push title="Open Details" target={<UserDetail user={user} />} />
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
          return (
            <List.Item
              key={organization.id}
              title={organization.name}
              subtitle={organization.domain_names?.join(", ") || ""}
              icon={undefined}
              actions={
                <ActionPanel>
                  <Action.Push title="Open Details" target={<OrganizationDetail organization={organization} />} />
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
