import { List, showToast, Toast, ActionPanel, Action, Image } from "@raycast/api";
import { useState, useEffect } from "react";
import { searchZendeskUsers, getZendeskUrl, ZendeskUser } from "./api/zendesk";
import UserDetail from "./user-detail";

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



export default function SearchPeople() {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const [users, setUsers] = useState<ZendeskUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function performSearch() {
      if (!debouncedSearchText) {
        setUsers([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchZendeskUsers(debouncedSearchText);
        setUsers(results);
      } catch (error: any) {
        showToast(Toast.Style.Failure, "Search Failed", error.message);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [debouncedSearchText]);

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search Zendesk users by name, email, etc."
      throttle
    >
      {users.length === 0 && !isLoading && searchText.length > 0 && (
        <List.EmptyView title="No Results Found" description="Try a different search query." />
      )}
      {users.length === 0 && !isLoading && searchText.length === 0 && (
        <List.EmptyView title="Start Typing to Search" description="Enter a name, email, or other keyword to find Zendesk users." />
      )}
      {users.map((user) => (
        <List.Item
          key={user.id}
          title={user.name}
          subtitle={user.email}
          icon={user.photo?.content_url ? { source: user.photo.content_url, mask: Image.Mask.Circle } : { source: "person-circle.png", mask: Image.Mask.Circle }}
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
      ))}
    </List>
  );
}
